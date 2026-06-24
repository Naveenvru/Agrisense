import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandParcel } from './land-parcel.entity';
import { FarmerProfile } from '../farmer-profiles/farmer-profile.entity';
import { LandParcelsService } from './land-parcels.service';
import { LandParcelsController } from './land-parcels.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LandParcel, FarmerProfile])],
  controllers: [LandParcelsController],
  providers: [LandParcelsService],
  exports: [LandParcelsService],
})
export class LandParcelsModule {}
