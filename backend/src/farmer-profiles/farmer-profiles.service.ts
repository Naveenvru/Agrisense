import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FarmerProfile } from './farmer-profile.entity';
import { User } from '../users/user.entity';
import { CreateFarmerProfileDto } from './dto/create-farmer-profile.dto';
import { UpdateFarmerProfileDto } from './dto/update-farmer-profile.dto';

@Injectable()
export class FarmerProfilesService {
  constructor(
    @InjectRepository(FarmerProfile)
    private farmerProfilesRepository: Repository<FarmerProfile>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
    let profile = await this.farmerProfilesRepository.findOne({
      where: { userId },
      relations: { user: true },
    });

    if (!profile) {
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      profile = this.farmerProfilesRepository.create({
        userId,
        district: null,
        state: null,
        village: null,
        totalLandArea: 0,
      });
      await this.farmerProfilesRepository.save(profile);
      if (user) {
        profile.user = user;
      }
    }

    return profile;
  }

  async update(
    userId: string,
    updateDto: UpdateFarmerProfileDto,
  ): Promise<FarmerProfile> {
    let profile = await this.farmerProfilesRepository.findOne({
      where: { userId },
      relations: { user: true },
    });

    if (!profile) {
      profile = await this.findByUserId(userId);
    }

    // Update profile fields
    if (updateDto.district !== undefined) profile.district = updateDto.district;
    if (updateDto.state !== undefined) profile.state = updateDto.state;
    if (updateDto.village !== undefined) profile.village = updateDto.village;
    if (updateDto.totalLandArea !== undefined) profile.totalLandArea = updateDto.totalLandArea;
    if (updateDto.primarySoilType !== undefined) profile.primarySoilType = updateDto.primarySoilType;
    if (updateDto.primaryIrrigationType !== undefined) profile.primaryIrrigationType = updateDto.primaryIrrigationType;

    const savedProfile = await this.farmerProfilesRepository.save(profile);

    // Update corresponding user record if user attributes provided
    const phone = updateDto.phoneNumber || updateDto.phone;
    const lang = updateDto.preferredLanguage || updateDto.language;

    const userUpdates: Partial<User> = {};
    if (updateDto.name !== undefined) userUpdates.name = updateDto.name;
    if (phone !== undefined) userUpdates.phoneNumber = phone;
    if (lang !== undefined) userUpdates.preferredLanguage = lang;

    if (Object.keys(userUpdates).length > 0) {
      await this.usersRepository.update(userId, userUpdates);
      const updatedUser = await this.usersRepository.findOne({ where: { id: userId } });
      if (updatedUser) {
        savedProfile.user = updatedUser;
      }
    }

    return savedProfile;
  }
}
