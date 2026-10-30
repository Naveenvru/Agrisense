import { DataSource, Repository } from 'typeorm';
import { LandParcel } from './land-parcel.entity';
import { FarmerProfile } from '../farmer-profiles/farmer-profile.entity';
import { CreateLandParcelDto } from './dto/create-land-parcel.dto';
import { UpdateLandParcelDto } from './dto/update-land-parcel.dto';
export declare class LandParcelsService {
    private readonly landParcelsRepository;
    private readonly farmerProfilesRepository;
    private readonly dataSource;
    constructor(landParcelsRepository: Repository<LandParcel>, farmerProfilesRepository: Repository<FarmerProfile>, dataSource: DataSource);
    private getFarmerProfileId;
    private verifyOwnership;
    private validatePolygon;
    private measurePolygon;
    private validateLandProfile;
    previewArea(boundaryGeoJson: unknown): Promise<{
        areaSqm: number;
        areaAcres: number;
        areaHectares: number;
        centroid: {
            latitude: number;
            longitude: number;
        };
    }>;
    create(userId: string, createDto: CreateLandParcelDto): Promise<any>;
    findAllByUser(userId: string): Promise<any[]>;
    findOneByUser(parcelId: string, userId: string): Promise<any>;
    update(parcelId: string, userId: string, updateDto: UpdateLandParcelDto): Promise<any>;
    findNearby(userId: string, latitude: number, longitude: number, radiusMeters: number): Promise<any>;
    findContaining(userId: string, latitude: number, longitude: number): Promise<any>;
    overlapSummary(parcelId: string, userId: string): Promise<{
        hasPotentialOverlap: boolean;
        intersectingParcelCount: number;
    }>;
    remove(parcelId: string, userId: string): Promise<void>;
    private findOneRaw;
}
