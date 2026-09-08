import { Repository } from 'typeorm';
import { FarmerProfile } from './farmer-profile.entity';
import { User } from '../users/user.entity';
import { CreateFarmerProfileDto } from './dto/create-farmer-profile.dto';
import { UpdateFarmerProfileDto } from './dto/update-farmer-profile.dto';
export declare class FarmerProfilesService {
    private farmerProfilesRepository;
    private usersRepository;
    constructor(farmerProfilesRepository: Repository<FarmerProfile>, usersRepository: Repository<User>);
    create(userId: string, createDto: CreateFarmerProfileDto): Promise<FarmerProfile>;
    findByUserId(userId: string): Promise<FarmerProfile>;
    update(userId: string, updateDto: UpdateFarmerProfileDto): Promise<FarmerProfile>;
}
