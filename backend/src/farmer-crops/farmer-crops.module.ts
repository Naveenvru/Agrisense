import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmerCrop } from './farmer-crop.entity';
import { FarmerCropsService } from './farmer-crops.service';
import { FarmerCropsController } from './farmer-crops.controller';
import { LandParcel } from '../land-parcels/land-parcel.entity';
import { Crop } from '../crops/crop.entity';
import { FarmerProfile } from '../farmer-profiles/farmer-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FarmerCrop, LandParcel, Crop, FarmerProfile])],
  controllers: [FarmerCropsController],
  providers: [FarmerCropsService],
  exports: [FarmerCropsService],
})
export class FarmerCropsModule {}
