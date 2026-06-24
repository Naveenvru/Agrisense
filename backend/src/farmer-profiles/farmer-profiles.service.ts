import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FarmerProfile } from './farmer-profile.entity';
import { CreateFarmerProfileDto } from './dto/create-farmer-profile.dto';
import { UpdateFarmerProfileDto } from './dto/update-farmer-profile.dto';

@Injectable()
export class FarmerProfilesService {
  constructor(
    @InjectRepository(FarmerProfile)
    private farmerProfilesRepository: Repository<FarmerProfile>,
  ) {}

  async create(
    userId: string,
    createDto: CreateFarmerProfileDto,
  ): Promise<FarmerProfile> {
    // Prevent duplicate profiles for the same user
    const existing = await this.farmerProfilesRepository.findOne({
      where: { userId },
    });
    if (existing) {
      throw new ConflictException('Farmer profile already exists for this user');
    }

    const profile = this.farmerProfilesRepository.create({
      userId,
      district: createDto.district || null,
      state: createDto.state || null,
      village: createDto.village || null,
      totalLandArea: createDto.totalLandArea ?? null,
      primarySoilType: createDto.primarySoilType || null,
      primaryIrrigationType: createDto.primaryIrrigationType || null,
    });

    return this.farmerProfilesRepository.save(profile);
  }

  async findByUserId(userId: string): Promise<FarmerProfile> {
    const profile = await this.farmerProfilesRepository.findOne({
      where: { userId },
      relations: { user: true },
    });
    if (!profile) {
      throw new NotFoundException('Farmer profile not found');
    }
    return profile;
  }

  async update(
    userId: string,
    updateDto: UpdateFarmerProfileDto,
  ): Promise<FarmerProfile> {
    const profile = await this.farmerProfilesRepository.findOne({
      where: { userId },
    });
    if (!profile) {
      throw new NotFoundException('Farmer profile not found. Please create one first.');
    }

    // Only update fields that are provided
    if (updateDto.district !== undefined) profile.district = updateDto.district;
    if (updateDto.state !== undefined) profile.state = updateDto.state;
    if (updateDto.village !== undefined) profile.village = updateDto.village;
    if (updateDto.totalLandArea !== undefined) profile.totalLandArea = updateDto.totalLandArea;
    if (updateDto.primarySoilType !== undefined) profile.primarySoilType = updateDto.primarySoilType;
    if (updateDto.primaryIrrigationType !== undefined) profile.primaryIrrigationType = updateDto.primaryIrrigationType;

    return this.farmerProfilesRepository.save(profile);
  }
}
