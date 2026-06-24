import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmerProfile } from './farmer-profile.entity';
import { FarmerProfilesService } from './farmer-profiles.service';
import { FarmerProfilesController } from './farmer-profiles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FarmerProfile])],
  controllers: [FarmerProfilesController],
  providers: [FarmerProfilesService],
  exports: [FarmerProfilesService],
})
export class FarmerProfilesModule {}
