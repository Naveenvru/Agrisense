import { Module } from '@nestjs/common';
import { VegetationController } from './vegetation.controller';
import { VegetationService } from './vegetation.service';

@Module({ controllers: [VegetationController], providers: [VegetationService] })
export class VegetationModule {}
