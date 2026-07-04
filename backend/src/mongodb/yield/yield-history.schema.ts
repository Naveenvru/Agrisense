import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'yield_history', timestamps: true })
export class YieldHistoryDocument extends Document {
  @Prop({ required: true, index: true })
  farmerCropId: string;

  @Prop({ index: true })
  farmerProfileId: string;

  @Prop()
  cropName: string;

  @Prop({ type: Date, default: Date.now })
  predictionTimestamp: Date;

  @Prop()
  previousYieldKg?: number;

  @Prop()
  newYieldKg?: number;

  @Prop()
  reason: string;

  @Prop()
  confidence: number;

  @Prop()
  qualityGrade: string;

  @Prop()
  riskLevel: string;

  @Prop()
  lossPercent: number;

  @Prop({ type: [String], default: [] })
  explanations: string[];

  @Prop({ type: Array, default: [] })
  recommendations: Record<string, any>[];

  @Prop({ default: 1 })
  version: number;
}

export const YieldHistorySchema = SchemaFactory.createForClass(YieldHistoryDocument);
YieldHistorySchema.index({ farmerCropId: 1, predictionTimestamp: -1 });
YieldHistorySchema.index({ farmerProfileId: 1 });
