import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FarmerCrop } from './farmer-crop.entity';
import { CreateFarmerCropDto } from './dto/create-farmer-crop.dto';
import { UpdateFarmerCropDto } from './dto/update-farmer-crop.dto';
import { LandParcel } from '../land-parcels/land-parcel.entity';
import { Crop } from '../crops/crop.entity';
import { FarmerProfile } from '../farmer-profiles/farmer-profile.entity';

@Injectable()
export class FarmerCropsService {
  constructor(
    @InjectRepository(FarmerCrop)
    private farmerCropsRepository: Repository<FarmerCrop>,
    @InjectRepository(LandParcel)
    private landParcelsRepository: Repository<LandParcel>,
    @InjectRepository(Crop)
    private cropsRepository: Repository<Crop>,
    @InjectRepository(FarmerProfile)
    private farmerProfilesRepository: Repository<FarmerProfile>,
  ) {}

  /**
   * Helper to verify that a given parcel ID exists and belongs to the authenticated user.
   */
  private async verifyParcelOwnership(parcelId: string, userId: string): Promise<LandParcel> {
    const profile = await this.farmerProfilesRepository.findOne({
      where: { userId },
    });
    
    if (!profile) {
      throw new ForbiddenException('Farmer profile not found. Cannot manage crops.');
    }

    const parcel = await this.landParcelsRepository.findOne({
      where: { id: parcelId },
    });

    if (!parcel) {
      throw new NotFoundException('Land parcel not found');
    }

    if (parcel.farmerProfileId !== profile.id) {
      throw new ForbiddenException('You do not have access to this land parcel');
    }

    return parcel;
  }

  /**
   * Helper to verify ownership of a specific farmer crop.
   */
  private async verifyFarmerCropOwnership(id: string, userId: string): Promise<FarmerCrop> {
    const farmerCrop = await this.farmerCropsRepository.findOne({
      where: { id },
      relations: { parcel: true },
    });

    if (!farmerCrop) {
      throw new NotFoundException('Farmer crop record not found');
    }

    // Reuse the parcel ownership check to ensure the user owns the parcel this crop is on
    await this.verifyParcelOwnership(farmerCrop.parcelId, userId);

    return farmerCrop;
  }

  async create(userId: string, createDto: CreateFarmerCropDto): Promise<FarmerCrop> {
    await this.verifyParcelOwnership(createDto.parcelId, userId);

    const crop = await this.cropsRepository.findOne({
      where: { id: createDto.cropId },
    });

    if (!crop) {
      throw new NotFoundException('Crop not found in master catalog');
    }

    const farmerCrop = this.farmerCropsRepository.create({
      parcelId: createDto.parcelId,
      cropId: createDto.cropId,
      cropVariety: createDto.cropVariety || null,
      sowingDate: createDto.sowingDate ? new Date(createDto.sowingDate) : null,
      expectedHarvestDate: createDto.expectedHarvestDate ? new Date(createDto.expectedHarvestDate) : null,
      estimatedYieldKg: createDto.estimatedYieldKg ?? null,
      actualYieldKg: createDto.actualYieldKg ?? null,
    });

    const savedCrop = await this.farmerCropsRepository.save(farmerCrop);
    return this.findOne(savedCrop.id, userId); // Return with populated relations
  }

  async findAll(userId: string): Promise<FarmerCrop[]> {
    const profile = await this.farmerProfilesRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      return [];
    }

    // Find all farmer crops where the parcel's farmerProfileId matches the user's profile ID
    return this.farmerCropsRepository.find({
      where: {
        parcel: {
          farmerProfileId: profile.id,
        },
      },
      relations: {
        parcel: true,
        crop: true,
      },
      order: {
        createdAt: 'DESC',
      },
      select: {
        parcel: {
          id: true,
          parcelName: true,
          areaAcres: true,
        },
        crop: {
          id: true,
          cropName: true,
          scientificName: true,
          season: true,
        },
      },
    });
  }

  async findOne(id: string, userId: string): Promise<FarmerCrop> {
    await this.verifyFarmerCropOwnership(id, userId);

    const farmerCrop = await this.farmerCropsRepository.findOne({
      where: { id },
      relations: {
        parcel: true,
        crop: true,
      },
      select: {
        parcel: {
          id: true,
          parcelName: true,
          areaAcres: true,
        },
        crop: {
          id: true,
          cropName: true,
          scientificName: true,
          season: true,
        },
      },
    });

    if (!farmerCrop) {
      throw new NotFoundException('Farmer crop record not found');
    }

    return farmerCrop;
  }

  async update(id: string, userId: string, updateDto: UpdateFarmerCropDto): Promise<FarmerCrop> {
    const farmerCrop = await this.verifyFarmerCropOwnership(id, userId);

    if (updateDto.cropVariety !== undefined) farmerCrop.cropVariety = updateDto.cropVariety;
    if (updateDto.sowingDate !== undefined) farmerCrop.sowingDate = updateDto.sowingDate ? new Date(updateDto.sowingDate) : null;
    if (updateDto.expectedHarvestDate !== undefined) farmerCrop.expectedHarvestDate = updateDto.expectedHarvestDate ? new Date(updateDto.expectedHarvestDate) : null;
    if (updateDto.estimatedYieldKg !== undefined) farmerCrop.estimatedYieldKg = updateDto.estimatedYieldKg;
    if (updateDto.actualYieldKg !== undefined) farmerCrop.actualYieldKg = updateDto.actualYieldKg;
    if (updateDto.status !== undefined) farmerCrop.status = updateDto.status;

    await this.farmerCropsRepository.save(farmerCrop);
    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.verifyFarmerCropOwnership(id, userId);
    await this.farmerCropsRepository.delete(id);
  }
}
