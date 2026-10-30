import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { LandParcel } from './land-parcel.entity';
import { FarmerProfile } from '../farmer-profiles/farmer-profile.entity';
import { CreateLandParcelDto } from './dto/create-land-parcel.dto';
import { UpdateLandParcelDto } from './dto/update-land-parcel.dto';

const SQM_PER_ACRE = 4046.8564224;
const SQM_PER_HECTARE = 10_000;

type PolygonGeoJson = { type: 'Polygon'; coordinates: number[][][] };

@Injectable()
export class LandParcelsService {
  constructor(
    @InjectRepository(LandParcel)
    private readonly landParcelsRepository: Repository<LandParcel>,
    @InjectRepository(FarmerProfile)
    private readonly farmerProfilesRepository: Repository<FarmerProfile>,
    private readonly dataSource: DataSource,
  ) {}

  private async getFarmerProfileId(userId: string): Promise<string> {
    let profile = await this.farmerProfilesRepository.findOne({ where: { userId } });
    if (!profile) {
      profile = this.farmerProfilesRepository.create({ userId, district: 'Default', state: 'Default' });
      profile = await this.farmerProfilesRepository.save(profile);
    }
    return profile.id;
  }

  private async verifyOwnership(parcelId: string, farmerProfileId: string): Promise<LandParcel> {
    const parcel = await this.landParcelsRepository.findOne({ where: { id: parcelId } });
    if (!parcel) throw new NotFoundException('Land parcel not found');
    if (parcel.farmerProfileId !== farmerProfileId) {
      throw new ForbiddenException('You do not have access to this land parcel');
    }
    return parcel;
  }

  private validatePolygon(input: unknown): PolygonGeoJson {
    if (!input || typeof input !== 'object' || (input as any).type !== 'Polygon' || !Array.isArray((input as any).coordinates)) {
      throw new BadRequestException('Farm boundary must be a GeoJSON Polygon.');
    }
    const rings = (input as any).coordinates as unknown[];
    if (!rings.length) throw new BadRequestException('Farm boundary polygon is empty.');

    for (const ring of rings) {
      if (!Array.isArray(ring) || ring.length < 4) {
        throw new BadRequestException('Each polygon ring needs at least three vertices and a closing coordinate.');
      }
      const points = ring.map((point) => {
        if (!Array.isArray(point) || point.length < 2) throw new BadRequestException('Boundary coordinates must be [longitude, latitude] pairs.');
        const [longitude, latitude] = point;
        if (typeof longitude !== 'number' || !Number.isFinite(longitude) || longitude < -180 || longitude > 180 ||
            typeof latitude !== 'number' || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
          throw new BadRequestException('Farm boundary contains invalid geographic coordinates.');
        }
        return [longitude, latitude] as const;
      });
      const first = points[0];
      const last = points[points.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        throw new BadRequestException('Farm boundary ring must be closed.');
      }
      const distinct = new Set(points.slice(0, -1).map(([lng, lat]) => `${lng},${lat}`));
      if (distinct.size < 3) throw new BadRequestException('Farm boundary needs at least three distinct vertices.');
    }
    return input as PolygonGeoJson;
  }

  private async measurePolygon(input: unknown) {
    const polygon = this.validatePolygon(input);
    const rows = await this.dataSource.query(
      `WITH candidate AS (
         SELECT ST_SetSRID(ST_GeomFromGeoJSON($1), 4326)::geometry(Polygon, 4326) AS geom
       )
       SELECT ST_IsValid(geom) AS valid,
              ST_IsValidReason(geom) AS reason,
              ST_IsEmpty(geom) AS empty,
              ST_Area(geom::geography) AS area_sqm,
              ST_X(ST_Centroid(geom)) AS centroid_longitude,
              ST_Y(ST_Centroid(geom)) AS centroid_latitude
       FROM candidate`,
      [JSON.stringify(polygon)],
    );
    const result = rows[0];
    if (!result?.valid || result.empty || Number(result.area_sqm) <= 0) {
      throw new BadRequestException(`Farm boundary is invalid: ${result?.reason || 'polygon has no area'}.`);
    }
    const areaSqm = Number(result.area_sqm);
    if (!Number.isFinite(areaSqm) || areaSqm <= 0) throw new BadRequestException('Farm boundary has no measurable area.');
    return {
      polygon,
      areaSqm,
      areaAcres: areaSqm / SQM_PER_ACRE,
      areaHectares: areaSqm / SQM_PER_HECTARE,
      centroidLatitude: Number(result.centroid_latitude),
      centroidLongitude: Number(result.centroid_longitude),
    };
  }

  private validateLandProfile(landProfile: Record<string, any> | undefined, totalAcres?: number | null) {
    if (!landProfile) return;
    const breakdown = landProfile.areaBreakdown;
    if (!breakdown) return;
    const values = ['cultivableAcres', 'nonCultivableAcres', 'fallowAcres']
      .map((key) => breakdown[key])
      .filter((value) => value !== undefined && value !== null && value !== '')
      .map(Number);
    if (values.some((value) => !Number.isFinite(value) || value < 0)) {
      throw new BadRequestException('Land sub-areas must be zero or positive numbers.');
    }
    const knownTotal = totalAcres ?? undefined;
    if (knownTotal !== undefined && values.reduce((sum, value) => sum + value, 0) > knownTotal + 0.0001) {
      throw new BadRequestException('Cultivable, non-cultivable, and fallow areas cannot exceed the parcel area.');
    }
  }

  async previewArea(boundaryGeoJson: unknown) {
    const area = await this.measurePolygon(boundaryGeoJson);
    return {
      areaSqm: area.areaSqm,
      areaAcres: area.areaAcres,
      areaHectares: area.areaHectares,
      centroid: { latitude: area.centroidLatitude, longitude: area.centroidLongitude },
    };
  }

  async create(userId: string, createDto: CreateLandParcelDto): Promise<any> {
    if ((createDto.latitude === undefined) !== (createDto.longitude === undefined)) {
      throw new BadRequestException('Latitude and longitude must be supplied together.');
    }
    const farmerProfileId = await this.getFarmerProfileId(userId);
    const measured = createDto.boundaryGeoJson ? await this.measurePolygon(createDto.boundaryGeoJson) : null;
    this.validateLandProfile(createDto.landProfile, measured?.areaAcres ?? createDto.areaAcres);
    if (!measured && (createDto.latitude === undefined || createDto.longitude === undefined)) {
      throw new BadRequestException('Provide a drawn farm boundary or a GPS coordinate for approximate location.');
    }

    const result = await this.dataSource.query(
      `INSERT INTO farmer_land_parcels (
         farmer_profile_id, parcel_name, area_acres, soil_type, land_type, irrigation_type,
         location, boundary_geom, centroid, calculated_area_sqm, calculated_area_acres,
         calculated_area_hectares, location_accuracy, village, taluk, district, state,
         pin_code, description, land_profile, additional_metadata
       ) VALUES (
         $1, $2, $3, $4, $5, $6,
         CASE WHEN $7::double precision IS NOT NULL THEN ST_SetSRID(ST_MakePoint($8, $7), 4326)::geography
              WHEN $9::double precision IS NOT NULL THEN ST_SetSRID(ST_MakePoint($10, $9), 4326)::geography ELSE NULL END,
         CASE WHEN $11::text IS NULL THEN NULL ELSE ST_SetSRID(ST_GeomFromGeoJSON($11), 4326)::geometry(Polygon,4326) END,
         CASE WHEN $12::double precision IS NULL THEN NULL ELSE ST_SetSRID(ST_MakePoint($13, $12),4326)::geography END,
         $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24::jsonb, $25::jsonb
       ) RETURNING id`,
      [
        farmerProfileId,
        createDto.parcelName?.trim() || null,
        createDto.areaAcres ?? null,
        createDto.soilType || null,
        createDto.landType || null,
        createDto.irrigationType || null,
        createDto.latitude ?? null,
        createDto.longitude ?? null,
        measured?.centroidLatitude ?? null,
        measured?.centroidLongitude ?? null,
        measured ? JSON.stringify(measured.polygon) : null,
        measured?.centroidLatitude ?? null,
        measured?.centroidLongitude ?? null,
        measured?.areaSqm ?? null,
        measured?.areaAcres ?? null,
        measured?.areaHectares ?? null,
        createDto.locationAccuracy || (measured ? 'boundary' : createDto.latitude !== undefined ? 'gps' : 'approximate'),
        createDto.village?.trim() || null,
        createDto.taluk?.trim() || null,
        createDto.district?.trim() || null,
        createDto.state?.trim() || null,
        createDto.pinCode?.trim() || null,
        createDto.description?.trim() || null,
        JSON.stringify(createDto.landProfile || {}),
        JSON.stringify(createDto.additionalMetadata || {}),
      ],
    );
    return this.findOneRaw(String(result[0].id));
  }

  async findAllByUser(userId: string): Promise<any[]> {
    const farmerProfileId = await this.getFarmerProfileId(userId);
    const rows = await this.dataSource.query(
      `SELECT id, farmer_profile_id AS "farmerProfileId", parcel_name AS "parcelName",
        area_acres AS "areaAcres", soil_type AS "soilType", land_type AS "landType",
        irrigation_type AS "irrigationType", ST_Y(COALESCE(location, centroid)::geometry) AS latitude,
        ST_X(COALESCE(location, centroid)::geometry) AS longitude, ST_AsGeoJSON(boundary_geom)::json AS "boundaryGeoJson",
        ST_Y(centroid::geometry) AS "centroidLatitude", ST_X(centroid::geometry) AS "centroidLongitude",
        calculated_area_sqm AS "calculatedAreaSqm", calculated_area_acres AS "calculatedAreaAcres",
        calculated_area_hectares AS "calculatedAreaHectares", location_accuracy AS "locationAccuracy",
        village, taluk, district, state, pin_code AS "pinCode", description,
        land_profile AS "landProfile", additional_metadata AS "additionalMetadata",
        created_at AS "createdAt", updated_at AS "updatedAt"
       FROM farmer_land_parcels WHERE farmer_profile_id = $1 ORDER BY created_at DESC`,
      [farmerProfileId],
    );
    return rows;
  }

  async findOneByUser(parcelId: string, userId: string): Promise<any> {
    const farmerProfileId = await this.getFarmerProfileId(userId);
    await this.verifyOwnership(parcelId, farmerProfileId);
    return this.findOneRaw(parcelId);
  }

  async update(parcelId: string, userId: string, updateDto: UpdateLandParcelDto): Promise<any> {
    const farmerProfileId = await this.getFarmerProfileId(userId);
    const existing = await this.verifyOwnership(parcelId, farmerProfileId);
    if ((updateDto.latitude === undefined) !== (updateDto.longitude === undefined)) {
      throw new BadRequestException('Latitude and longitude must be supplied together.');
    }
    const measured = updateDto.boundaryGeoJson ? await this.measurePolygon(updateDto.boundaryGeoJson) : null;
    const effectiveArea = measured?.areaAcres ?? (Number(existing.calculatedAreaAcres ?? existing.areaAcres ?? 0) || undefined);
    this.validateLandProfile(updateDto.landProfile, effectiveArea);

    const fields: Array<[string, unknown]> = [
      ['parcel_name', updateDto.parcelName?.trim() || null],
      ['area_acres', updateDto.areaAcres],
      ['soil_type', updateDto.soilType],
      ['land_type', updateDto.landType],
      ['irrigation_type', updateDto.irrigationType],
      ['village', updateDto.village?.trim() || null],
      ['taluk', updateDto.taluk?.trim() || null],
      ['district', updateDto.district?.trim() || null],
      ['state', updateDto.state?.trim() || null],
      ['pin_code', updateDto.pinCode?.trim() || null],
      ['description', updateDto.description?.trim() || null],
      ['land_profile', updateDto.landProfile ? JSON.stringify(updateDto.landProfile) : undefined],
      ['additional_metadata', updateDto.additionalMetadata ? JSON.stringify(updateDto.additionalMetadata) : undefined],
      ['location_accuracy', updateDto.locationAccuracy],
    ];
    const assignments: string[] = [];
    const values: unknown[] = [];
    for (const [column, value] of fields) {
      if (value === undefined) continue;
      values.push(value);
      assignments.push(`${column} = $${values.length}${column === 'land_profile' || column === 'additional_metadata' ? '::jsonb' : ''}`);
    }
    if (updateDto.latitude !== undefined && updateDto.longitude !== undefined) {
      values.push(updateDto.longitude, updateDto.latitude);
      assignments.push(`location = ST_SetSRID(ST_MakePoint($${values.length - 1}, $${values.length}),4326)::geography`);
      if (!updateDto.locationAccuracy) assignments.push(`location_accuracy = 'gps'`);
    }
    if (measured) {
      const jsonParam = values.length + 1;
      values.push(JSON.stringify(measured.polygon));
      assignments.push(`boundary_geom = ST_SetSRID(ST_GeomFromGeoJSON($${jsonParam}),4326)::geometry(Polygon,4326)`);
      values.push(measured.centroidLongitude, measured.centroidLatitude, measured.areaSqm, measured.areaAcres, measured.areaHectares);
      const offset = values.length - 4;
      assignments.push(`centroid = ST_SetSRID(ST_MakePoint($${offset},$${offset + 1}),4326)::geography`);
      assignments.push(`calculated_area_sqm = $${offset + 2}, calculated_area_acres = $${offset + 3}, calculated_area_hectares = $${offset + 4}`);
      if (!updateDto.locationAccuracy) assignments.push(`location_accuracy = 'boundary'`);
      assignments.push(`location = COALESCE(location, ST_SetSRID(ST_MakePoint($${offset},$${offset + 1}),4326)::geography)`);
    }
    if (!assignments.length) return this.findOneRaw(parcelId);
    values.push(parcelId);
    await this.dataSource.query(
      `UPDATE farmer_land_parcels SET ${assignments.join(', ')}, updated_at = NOW() WHERE id = $${values.length}`,
      values,
    );
    return this.findOneRaw(parcelId);
  }

  async findNearby(userId: string, latitude: number, longitude: number, radiusMeters: number) {
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      throw new BadRequestException('Valid latitude and longitude are required.');
    }
    if (!Number.isFinite(radiusMeters) || radiusMeters < 1 || radiusMeters > 100_000) {
      throw new BadRequestException('Radius must be between 1 metre and 100 kilometres.');
    }
    const profileId = await this.getFarmerProfileId(userId);
    return this.dataSource.query(
      `SELECT id, parcel_name AS "parcelName", ST_Distance(COALESCE(centroid, location), ST_SetSRID(ST_MakePoint($1,$2),4326)::geography) AS "distanceMeters",
         calculated_area_acres AS "calculatedAreaAcres", location_accuracy AS "locationAccuracy"
       FROM farmer_land_parcels WHERE farmer_profile_id = $3 AND COALESCE(centroid, location) IS NOT NULL
         AND ((centroid IS NOT NULL AND ST_DWithin(centroid, ST_SetSRID(ST_MakePoint($1,$2),4326)::geography, $4))
           OR (centroid IS NULL AND ST_DWithin(location, ST_SetSRID(ST_MakePoint($1,$2),4326)::geography, $4)))
       ORDER BY "distanceMeters"`,
      [longitude, latitude, profileId, radiusMeters],
    );
  }

  async findContaining(userId: string, latitude: number, longitude: number) {
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      throw new BadRequestException('Valid latitude and longitude are required.');
    }
    const profileId = await this.getFarmerProfileId(userId);
    return this.dataSource.query(
      `SELECT id, parcel_name AS "parcelName", calculated_area_acres AS "calculatedAreaAcres"
       FROM farmer_land_parcels WHERE farmer_profile_id = $1 AND boundary_geom IS NOT NULL
         AND ST_Covers(boundary_geom, ST_SetSRID(ST_MakePoint($2,$3),4326))
       ORDER BY id`, [profileId, longitude, latitude],
    );
  }

  async overlapSummary(parcelId: string, userId: string) {
    const profileId = await this.getFarmerProfileId(userId);
    await this.verifyOwnership(parcelId, profileId);
    const rows = await this.dataSource.query(
      `SELECT COUNT(*)::int AS count FROM farmer_land_parcels candidate
       JOIN farmer_land_parcels selected ON selected.id = $1
       WHERE candidate.id <> selected.id AND candidate.boundary_geom IS NOT NULL
         AND selected.boundary_geom IS NOT NULL AND ST_Intersects(candidate.boundary_geom, selected.boundary_geom)
         AND ST_Area(ST_Intersection(candidate.boundary_geom, selected.boundary_geom)::geography) > 1`,
      [parcelId],
    );
    return { hasPotentialOverlap: Number(rows[0]?.count || 0) > 0, intersectingParcelCount: Number(rows[0]?.count || 0) };
  }

  async remove(parcelId: string, userId: string): Promise<void> {
    const farmerProfileId = await this.getFarmerProfileId(userId);
    await this.verifyOwnership(parcelId, farmerProfileId);
    await this.landParcelsRepository.delete(parcelId);
  }

  private async findOneRaw(parcelId: string): Promise<any> {
    const rows = await this.dataSource.query(
      `SELECT id, farmer_profile_id AS "farmerProfileId", parcel_name AS "parcelName",
        area_acres AS "areaAcres", soil_type AS "soilType", land_type AS "landType",
        irrigation_type AS "irrigationType", ST_Y(COALESCE(location, centroid)::geometry) AS latitude,
        ST_X(COALESCE(location, centroid)::geometry) AS longitude, ST_AsGeoJSON(boundary_geom)::json AS "boundaryGeoJson",
        ST_Y(centroid::geometry) AS "centroidLatitude", ST_X(centroid::geometry) AS "centroidLongitude",
        calculated_area_sqm AS "calculatedAreaSqm", calculated_area_acres AS "calculatedAreaAcres",
        calculated_area_hectares AS "calculatedAreaHectares", location_accuracy AS "locationAccuracy",
        village, taluk, district, state, pin_code AS "pinCode", description,
        land_profile AS "landProfile", additional_metadata AS "additionalMetadata",
        created_at AS "createdAt", updated_at AS "updatedAt"
       FROM farmer_land_parcels WHERE id = $1`,
      [parcelId],
    );
    if (!rows.length) throw new NotFoundException('Land parcel not found');
    return rows[0];
  }
}
