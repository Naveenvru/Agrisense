import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'demand_intelligence', timestamps: true })
export class DemandIntelligenceDocument extends Document {
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
  currentDemandKg: number;

  @Prop()
  expectedDemandKg: number;

  @Prop()
  governmentProcurementKg: number;

  @Prop()
  exportDemandKg: number;

  @Prop()
  retailDemandKg: number;

  @Prop()
  industrialDemandKg: number;

  @Prop()
  festivalDemandKg: number;

  @Prop()
  demandDensityKgPerAcre: number;

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

  @Prop({ type: Date, default: Date.now })
  assessedAt: Date;

  @Prop({ default: 1 })
  version: number;
}

export const DemandIntelligenceSchema = SchemaFactory.createForClass(DemandIntelligenceDocument);
DemandIntelligenceSchema.index({ farmerCropId: 1 }, { unique: true });
DemandIntelligenceSchema.index({ farmerProfileId: 1 });
DemandIntelligenceSchema.index({ assessedAt: -1 });
DemandIntelligenceSchema.index({ regionLevel: 1, regionName: 1 });
