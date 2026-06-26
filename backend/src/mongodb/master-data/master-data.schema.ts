import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// ---------------------------------------------------------------------------
// 1. States
// ---------------------------------------------------------------------------
@Schema({ timestamps: true, collection: 'master_states' })
export class State extends Document {
  @Prop({ required: true, unique: true, index: true })
  name: string;

  @Prop()
  code: string;
}
export const StateSchema = SchemaFactory.createForClass(State);

// ---------------------------------------------------------------------------
// 2. Districts
// ---------------------------------------------------------------------------
@Schema({ timestamps: true, collection: 'master_districts' })
export class District extends Document {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true, index: true })
  stateId: string;
}
export const DistrictSchema = SchemaFactory.createForClass(District);
DistrictSchema.index({ name: 1, stateId: 1 }, { unique: true });

// ---------------------------------------------------------------------------
// 3. Taluks
// ---------------------------------------------------------------------------
@Schema({ timestamps: true, collection: 'master_taluks' })
export class Taluk extends Document {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true, index: true })
  districtId: string;
}
export const TalukSchema = SchemaFactory.createForClass(Taluk);
TalukSchema.index({ name: 1, districtId: 1 }, { unique: true });

// ---------------------------------------------------------------------------
// 4. Villages
// ---------------------------------------------------------------------------
@Schema({ timestamps: true, collection: 'master_villages' })
export class Village extends Document {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true, index: true })
  talukId: string;
}
export const VillageSchema = SchemaFactory.createForClass(Village);
VillageSchema.index({ name: 1, talukId: 1 }, { unique: true });

// ---------------------------------------------------------------------------
// 5. Mandis
// ---------------------------------------------------------------------------
@Schema({ timestamps: true, collection: 'master_mandis' })
export class Mandi extends Document {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true, index: true })
  districtId: string;
}
export const MandiSchema = SchemaFactory.createForClass(Mandi);
MandiSchema.index({ name: 1, districtId: 1 }, { unique: true });

// ---------------------------------------------------------------------------
// 6. Commodities
// ---------------------------------------------------------------------------
@Schema({ timestamps: true, collection: 'master_commodities' })
export class Commodity extends Document {
  @Prop({ required: true, unique: true, index: true })
  name: string;

  @Prop()
  category: string;
}
export const CommoditySchema = SchemaFactory.createForClass(Commodity);

// ---------------------------------------------------------------------------
// 7. Crop Varieties
// ---------------------------------------------------------------------------
@Schema({ timestamps: true, collection: 'master_crop_varieties' })
export class CropVariety extends Document {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true, index: true })
  commodityId: string;
}
export const CropVarietySchema = SchemaFactory.createForClass(CropVariety);
CropVarietySchema.index({ name: 1, commodityId: 1 }, { unique: true });

// ---------------------------------------------------------------------------
// 8. Seasons
// ---------------------------------------------------------------------------
@Schema({ timestamps: true, collection: 'master_seasons' })
export class Season extends Document {
  @Prop({ required: true, unique: true, index: true })
  name: string;

  @Prop()
  startMonth: number;

  @Prop()
  endMonth: number;
}
export const SeasonSchema = SchemaFactory.createForClass(Season);

// ---------------------------------------------------------------------------
// 9. Soil Types
// ---------------------------------------------------------------------------
@Schema({ timestamps: true, collection: 'master_soil_types' })
export class SoilType extends Document {
  @Prop({ required: true, unique: true, index: true })
  name: string;

  @Prop()
  description: string;
}
export const SoilTypeSchema = SchemaFactory.createForClass(SoilType);

// ---------------------------------------------------------------------------
// 10. Irrigation Types
// ---------------------------------------------------------------------------
@Schema({ timestamps: true, collection: 'master_irrigation_types' })
export class IrrigationType extends Document {
  @Prop({ required: true, unique: true, index: true })
  name: string;
}
export const IrrigationTypeSchema = SchemaFactory.createForClass(IrrigationType);

// ---------------------------------------------------------------------------
// 11. Fertilizers
// ---------------------------------------------------------------------------
@Schema({ timestamps: true, collection: 'master_fertilizers' })
export class Fertilizer extends Document {
  @Prop({ required: true, unique: true, index: true })
  name: string;

  @Prop()
  type: string;
}
export const FertilizerSchema = SchemaFactory.createForClass(Fertilizer);

// ---------------------------------------------------------------------------
// 12. Pesticides
// ---------------------------------------------------------------------------
@Schema({ timestamps: true, collection: 'master_pesticides' })
export class Pesticide extends Document {
  @Prop({ required: true, unique: true, index: true })
  name: string;

  @Prop()
  type: string;
}
export const PesticideSchema = SchemaFactory.createForClass(Pesticide);
