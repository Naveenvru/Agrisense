import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { LandParcel } from './land-parcel.entity';
import { FarmerProfile } from '../farmer-profiles/farmer-profile.entity';
import { CreateLandParcelDto } from './dto/create-land-parcel.dto';
import { UpdateLandParcelDto } from './dto/update-land-parcel.dto';

@Injectable()
export class LandParcelsService {
  constructor(
    @InjectRepository(LandParcel)
    private landParcelsRepository: Repository<LandParcel>,
    @InjectRepository(FarmerProfile)
    private farmerProfilesRepository: Repository<FarmerProfile>,
    private dataSource: DataSource,
  ) {}

  /**
   * Resolve the farmer_profile_id from the authenticated user's ID.
   */
  private async getFarmerProfileId(userId: string): Promise<string> {
    const profile = await this.farmerProfilesRepository.findOne({
      where: { userId },
    });
    if (!profile) {
      throw new NotFoundException(
        'Farmer profile not found. Create a farmer profile before managing land parcels.',
      );
    }
    return profile.id;
  }

  /**
   * Verify that a parcel belongs to the authenticated user's farmer profile.
   */
  private async verifyOwnership(
    parcelId: string,
    farmerProfileId: string,
  ): Promise<LandParcel> {
    const parcel = await this.landParcelsRepository.findOne({
      where: { id: parcelId },
    });
    if (!parcel) {
      throw new NotFoundException('Land parcel not found');
    }
    if (parcel.farmerProfileId !== farmerProfileId) {
      throw new ForbiddenException('You do not have access to this land parcel');
    }
    return parcel;
  }

  /**
   * Build a raw SQL fragment for ST_SetSRID(ST_MakePoint(lng, lat), 4326).
   */
  private buildLocationPoint(
    longitude?: number,
    latitude?: number,
  ): (() => string) | undefined {
    if (latitude !== undefined && longitude !== undefined) {
      return () =>
        `ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`;
    }
    return undefined;
  }

  async create(
    userId: string,
    createDto: CreateLandParcelDto,
  ): Promise<any> {
    const farmerProfileId = await this.getFarmerProfileId(userId);

    const locationSql = this.buildLocationPoint(createDto.longitude, createDto.latitude);

    // Use QueryBuilder to insert with raw PostGIS function
    const result = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(LandParcel)
      .values({
        farmerProfileId,
        parcelName: createDto.parcelName || null,
        areaAcres: createDto.areaAcres ?? null,
        soilType: createDto.soilType || null,
        landType: createDto.landType || null,
        irrigationType: createDto.irrigationType || null,
        location: locationSql,
        additionalMetadata: createDto.additionalMetadata || null,
      })
      .returning('id')
      .execute();

    const insertedId = result.generatedMaps[0]?.id ?? result.raw[0]?.id;
    return this.findOneRaw(insertedId);
  }

  async findAllByUser(userId: string): Promise<any[]> {
    const farmerProfileId = await this.getFarmerProfileId(userId);

    const parcels = await this.dataSource.query(
      `SELECT
        id,
        farmer_profile_id AS "farmerProfileId",
        parcel_name AS "parcelName",
        area_acres AS "areaAcres",
        soil_type AS "soilType",
        land_type AS "landType",
        irrigation_type AS "irrigationType",
        ST_Y(location::geometry) AS "latitude",
        ST_X(location::geometry) AS "longitude",
        additional_metadata AS "additionalMetadata",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM farmer_land_parcels
      WHERE farmer_profile_id = $1
      ORDER BY created_at DESC`,
      [farmerProfileId],
    );

    return parcels;
  }

  async findOneByUser(parcelId: string, userId: string): Promise<any> {
    const farmerProfileId = await this.getFarmerProfileId(userId);
    await this.verifyOwnership(parcelId, farmerProfileId);
    return this.findOneRaw(parcelId);
  }

  async update(
    parcelId: string,
    userId: string,
    updateDto: UpdateLandParcelDto,
  ): Promise<any> {
    const farmerProfileId = await this.getFarmerProfileId(userId);
    const parcel = await this.verifyOwnership(parcelId, farmerProfileId);

    // Build SET clauses dynamically
    const setClauses: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (updateDto.parcelName !== undefined) {
      setClauses.push(`parcel_name = $${paramIndex++}`);
      params.push(updateDto.parcelName);
    }
    if (updateDto.areaAcres !== undefined) {
      setClauses.push(`area_acres = $${paramIndex++}`);
      params.push(updateDto.areaAcres);
    }
    if (updateDto.soilType !== undefined) {
      setClauses.push(`soil_type = $${paramIndex++}`);
      params.push(updateDto.soilType);
    }
    if (updateDto.landType !== undefined) {
      setClauses.push(`land_type = $${paramIndex++}`);
      params.push(updateDto.landType);
    }
    if (updateDto.irrigationType !== undefined) {
      setClauses.push(`irrigation_type = $${paramIndex++}`);
      params.push(updateDto.irrigationType);
    }
    if (updateDto.latitude !== undefined && updateDto.longitude !== undefined) {
      setClauses.push(
        `location = ST_SetSRID(ST_MakePoint($${paramIndex++}, $${paramIndex++}), 4326)`,
      );
      params.push(updateDto.longitude, updateDto.latitude);
    }
    if (updateDto.additionalMetadata !== undefined) {
      setClauses.push(`additional_metadata = $${paramIndex++}`);
      params.push(JSON.stringify(updateDto.additionalMetadata));
    }

    if (setClauses.length === 0) {
      return this.findOneRaw(parcelId);
    }

    setClauses.push(`updated_at = NOW()`);
    params.push(parcelId);

    await this.dataSource.query(
      `UPDATE farmer_land_parcels SET ${setClauses.join(', ')} WHERE id = $${paramIndex}`,
      params,
    );

    return this.findOneRaw(parcelId);
  }

  async remove(parcelId: string, userId: string): Promise<void> {
    const farmerProfileId = await this.getFarmerProfileId(userId);
    await this.verifyOwnership(parcelId, farmerProfileId);
    await this.landParcelsRepository.delete(parcelId);
  }

  /**
   * Fetch a single parcel with lat/lng extracted from PostGIS.
   */
  private async findOneRaw(parcelId: string): Promise<any> {
    const rows = await this.dataSource.query(
      `SELECT
        id,
        farmer_profile_id AS "farmerProfileId",
        parcel_name AS "parcelName",
        area_acres AS "areaAcres",
        soil_type AS "soilType",
        land_type AS "landType",
        irrigation_type AS "irrigationType",
        ST_Y(location::geometry) AS "latitude",
        ST_X(location::geometry) AS "longitude",
        additional_metadata AS "additionalMetadata",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM farmer_land_parcels
      WHERE id = $1`,
      [parcelId],
    );
    if (!rows.length) {
      throw new NotFoundException('Land parcel not found');
    }
    return rows[0];
  }
}
