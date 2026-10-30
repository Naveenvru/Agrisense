import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CropConditionDocument = HydratedDocument<CropCondition>;

@Schema({ timestamps: true, collection: 'farmer_crop_conditions' })
export class CropCondition {
  @Prop({ required: true, index: true }) userId: string;
  @Prop({ required: true, index: true }) farmerProfileId: string;
  @Prop({ required: true, index: true }) parcelId: string;
  @Prop({ required: true, index: true }) farmerCropId: string;
  @Prop({ required: true, default: Date.now, index: true }) observedAt: Date;
  @Prop({ required: true, maxlength: 120 }) conditionLabel: string;
  @Prop({ maxlength: 100 }) growthStage?: string;
  @Prop({ min: 0, max: 100 }) soilMoisturePercent?: number;
  @Prop({ min: -30, max: 70 }) airTemperatureC?: number;
  @Prop({ min: 0, max: 1000 }) rainfallMm?: number;
  @Prop({ maxlength: 120 }) irrigationStatus?: string;
  @Prop({ maxlength: 4000 }) symptomsAndSigns?: string;
  @Prop({ maxlength: 4000 }) notes?: string;
}

export const CropConditionSchema = SchemaFactory.createForClass(CropCondition);
CropConditionSchema.index({ userId: 1, farmerCropId: 1, observedAt: -1 });
