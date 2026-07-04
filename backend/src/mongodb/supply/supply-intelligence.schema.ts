import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'supply_intelligence', timestamps: true })
export class SupplyIntelligenceDocument extends Document {
  @Prop({ required: true })
  farmerCropId: string;

  @Prop()
  farmerProfileId: string;

  @Prop()
  cropName: string;

  @Prop()
  cropVariety?: string;

  @Prop()
  cropCategory?: string;

  @Prop()
  regionLevel: 'village' | 'taluk' | 'district' | 'state';

  @Prop()
  regionName: string;

  @Prop()
  villageName?: string;

  @Prop()
  talukName?: string;

  @Prop()
  districtName?: string;

  @Prop()
  stateName?: string;

  @Prop()
  areaAcres: number;

  @Prop({ type: Date })
  expectedHarvestDate?: Date;

  @Prop()
  expectedSupplyKg: number;

  @Prop()
  expectedYieldKg: number;

  @Prop()
  availableSupplyKg: number;

  @Prop()
  supplyDensityKgPerAcre: number;

  @Prop()
  confidence: number;

  @Prop()
  confidenceBand: string;

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

  @Prop({ type: Object, default: {} })
  seasonalAnalysis: Record<string, any>;

  @Prop({ type: Array, default: [] })
  timeline: Record<string, any>[];

  @Prop({ type: Array, default: [] })
  recommendations: Record<string, any>[];

  @Prop()
  harvestStage: string;

  @Prop()
  yieldStage: string;

  @Prop()
  weatherSummary: string;

  @Prop({ type: Date, default: Date.now })
  assessedAt: Date;

  @Prop({ default: 1 })
  version: number;
}

export const SupplyIntelligenceSchema = SchemaFactory.createForClass(SupplyIntelligenceDocument);
SupplyIntelligenceSchema.index({ farmerCropId: 1 }, { unique: true });
SupplyIntelligenceSchema.index({ farmerProfileId: 1 });
SupplyIntelligenceSchema.index({ assessedAt: -1 });