import { Repository } from 'typeorm';
import { FarmerCrop } from './farmer-crop.entity';
import { CreateFarmerCropDto } from './dto/create-farmer-crop.dto';
import { UpdateFarmerCropDto } from './dto/update-farmer-crop.dto';
import { LandParcel } from '../land-parcels/land-parcel.entity';
import { Crop } from '../crops/crop.entity';
import { FarmerProfile } from '../farmer-profiles/farmer-profile.entity';
export declare class FarmerCropsService {
    private farmerCropsRepository;
    private landParcelsRepository;
    private cropsRepository;
    private farmerProfilesRepository;
    constructor(farmerCropsRepository: Repository<FarmerCrop>, landParcelsRepository: Repository<LandParcel>, cropsRepository: Repository<Crop>, farmerProfilesRepository: Repository<FarmerProfile>);
    private verifyParcelOwnership;
    private verifyFarmerCropOwnership;
    create(userId: string, createDto: CreateFarmerCropDto): Promise<FarmerCrop>;
    findAll(userId: string): Promise<FarmerCrop[]>;
    findOne(id: string, userId: string): Promise<FarmerCrop>;
    update(id: string, userId: string, updateDto: UpdateFarmerCropDto): Promise<FarmerCrop>;
    remove(id: string, userId: string): Promise<void>;
}
