import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  State, StateSchema,
  District, DistrictSchema,
  Taluk, TalukSchema,
  Village, VillageSchema,
  Mandi, MandiSchema,
  Commodity, CommoditySchema,
  CropVariety, CropVarietySchema,
  Season, SeasonSchema,
  SoilType, SoilTypeSchema,
  IrrigationType, IrrigationTypeSchema,
  Fertilizer, FertilizerSchema,
  Pesticide, PesticideSchema,
} from './master-data.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: State.name, schema: StateSchema },
      { name: District.name, schema: DistrictSchema },
      { name: Taluk.name, schema: TalukSchema },
      { name: Village.name, schema: VillageSchema },
      { name: Mandi.name, schema: MandiSchema },
      { name: Commodity.name, schema: CommoditySchema },
      { name: CropVariety.name, schema: CropVarietySchema },
      { name: Season.name, schema: SeasonSchema },
      { name: SoilType.name, schema: SoilTypeSchema },
      { name: IrrigationType.name, schema: IrrigationTypeSchema },
      { name: Fertilizer.name, schema: FertilizerSchema },
      { name: Pesticide.name, schema: PesticideSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class MasterDataMongoModule {}
