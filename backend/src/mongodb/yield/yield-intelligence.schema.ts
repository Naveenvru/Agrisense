import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'yield_intelligence', timestamps: true })
export class YieldIntelligenceDocument extends Document {
  @Prop({ required: true, index: true })
  farmerCropId: string;

  @Prop({ index: true })
  farmerProfileId: string;

  @Prop()
  cropName: string;

  @Prop()
  cropVariety?: string;

  @Prop()
  cropCategory?: string;

  @Prop()
  areaAcres: number;

  @Prop()
  soilType?: string;

  @Prop()
  soilFertilityScore: number;

  @Prop()
  irrigationType?: string;

  @Prop()
  lifecycleStage: string;

  @Prop()
  growthPercentage: number;

  @Prop()
  readinessScore: number;

  @Prop()
  currentWeatherSummary: string;

  @Prop()
  expectedYieldKg: number;

  @Prop()
  yieldPerAcreKg: number;

  @Prop()
  expectedProductionKg: number;

  @Prop()
  confidence: number;

  @Prop()
  explanation: string;

  @Prop({ type: [String], default: [] })
  explanations: string[];

  @Prop()
  riskLevel: string;

  @Prop()
  riskScore: number;

  @Prop({ type: [String], default: [] })
  riskReasons: string[];

  @Prop({ type: [String], default: [] })
  mitigationRecommendations: string[];

  @Prop()
  confidenceBand: string;

  @Prop()
  confidenceExplanation: string;

  @Prop()
  qualityGrade: string;

  @Prop()
  qualityScore: number;

  @Prop({ type: [String], default: [] })
  qualityFactors: string[];

  @Prop()
  qualityExplanation: string;

  @Prop()
  expectedLossPercent: number;

  @Prop()
  expectedLossQuantityKg: number;

  @Prop({ type: [String], default: [] })
  lossReasons: string[];

  @Prop()
  lossExplanation: string;

  @Prop({ type: Array, default: [] })
  recommendations: Record<string, any>[];

  @Prop({ type: Object, default: {} })
  weather: Record<string, any>;

  @Prop({ type: Array, default: [] })
  weatherHistory: Record<string, any>[];

  @Prop({ type: Object, default: {} })
  activities: Record<string, any>;

  @Prop({ type: Object, default: {} })
  lifecycle: Record<string, any>;

  @Prop({ type: Date, default: Date.now })
  assessedAt: Date;

  @Prop({ default: 1 })
  version: number;
}

export const YieldIntelligenceSchema = SchemaFactory.createForClass(YieldIntelligenceDocument);
YieldIntelligenceSchema.index({ farmerCropId: 1 }, { unique: true });
YieldIntelligenceSchema.index({ farmerProfileId: 1 });
YieldIntelligenceSchema.index({ assessedAt: -1 });
