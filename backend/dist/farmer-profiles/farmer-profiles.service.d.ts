import { Repository } from 'typeorm';
import { FarmerProfile } from './farmer-profile.entity';
import { CreateFarmerProfileDto } from './dto/create-farmer-profile.dto';
import { UpdateFarmerProfileDto } from './dto/update-farmer-profile.dto';
export declare class FarmerProfilesService {
    private farmerProfilesRepository;
    constructor(farmerProfilesRepository: Repository<FarmerProfile>);
    create(userId: string, createDto: CreateFarmerProfileDto): Promise<FarmerProfile>;
    findByUserId(userId: string): Promise<FarmerProfile>;
    update(userId: string, updateDto: UpdateFarmerProfileDto): Promise<FarmerProfile>;
}
