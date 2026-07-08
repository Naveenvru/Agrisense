import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'demand_history', timestamps: true })
export class DemandHistoryDocument extends Document {
  @Prop({ required: true })
  farmerCropId: string;

  @Prop()
  farmerProfileId: string;

  @Prop()
  cropName: string;

  @Prop()
  previousDemandKg?: number;

  @Prop()
  newDemandKg: number;

  @Prop()
  reason: string;

  @Prop()
  confidence: number;

  @Prop()
  riskLevel: string;

  @Prop()
  demandDensityKgPerAcre: number;

  @Prop({ type: [String], default: [] })
  explanations: string[];

  @Prop({ type: Array, default: [] })
  recommendations: Record<string, any>[];

  @Prop({ default: 1 })
  version: number;

  @Prop({ type: Date, default: Date.now })
  predictionTimestamp: Date;
}

export const DemandHistorySchema = SchemaFactory.createForClass(DemandHistoryDocument);
DemandHistorySchema.index({ farmerCropId: 1 });
DemandHistorySchema.index({ farmerProfileId: 1 });
DemandHistorySchema.index({ predictionTimestamp: -1 });
