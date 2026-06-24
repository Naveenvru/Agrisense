import { Repository, DataSource } from 'typeorm';
import { LandParcel } from './land-parcel.entity';
import { FarmerProfile } from '../farmer-profiles/farmer-profile.entity';
import { CreateLandParcelDto } from './dto/create-land-parcel.dto';
import { UpdateLandParcelDto } from './dto/update-land-parcel.dto';
export declare class LandParcelsService {
    private landParcelsRepository;
    private farmerProfilesRepository;
    private dataSource;
    constructor(landParcelsRepository: Repository<LandParcel>, farmerProfilesRepository: Repository<FarmerProfile>, dataSource: DataSource);
    private getFarmerProfileId;
    private verifyOwnership;
    private buildLocationPoint;
    create(userId: string, createDto: CreateLandParcelDto): Promise<any>;
    findAllByUser(userId: string): Promise<any[]>;
    findOneByUser(parcelId: string, userId: string): Promise<any>;
    update(parcelId: string, userId: string, updateDto: UpdateLandParcelDto): Promise<any>;
    remove(parcelId: string, userId: string): Promise<void>;
    private findOneRaw;
}
