import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'supply_history', timestamps: true })
export class SupplyHistoryDocument extends Document {
  @Prop({ required: true })
  farmerCropId: string;

  @Prop()
  farmerProfileId: string;

  @Prop()
  cropName: string;

  @Prop()
  previousSupplyKg?: number;

  @Prop()
  newSupplyKg: number;

  @Prop()
  reason: string;

  @Prop()
  confidence: number;

  @Prop()
  riskLevel: string;

  @Prop()
  supplyDensityKgPerAcre: number;

  @Prop({ type: [String], default: [] })
  explanations: string[];

  @Prop({ type: Array, default: [] })
  recommendations: Record<string, any>[];

  @Prop({ default: 1 })
  version: number;

  @Prop({ type: Date, default: Date.now })
  predictionTimestamp: Date;
}

export const SupplyHistorySchema = SchemaFactory.createForClass(SupplyHistoryDocument);
SupplyHistorySchema.index({ farmerCropId: 1 });
SupplyHistorySchema.index({ farmerProfileId: 1 });
SupplyHistorySchema.index({ predictionTimestamp: -1 });