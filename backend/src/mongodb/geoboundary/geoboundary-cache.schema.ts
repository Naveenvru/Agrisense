import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'geoboundary_cache', timestamps: true })
export class GeoBoundaryCache extends Document {
  @Prop({ required: true, index: true })
  latitude: number;

  @Prop({ required: true, index: true })
  longitude: number;

  // Provider strings
  @Prop()
  villageName?: string;

  @Prop()
  talukName?: string;

  @Prop()
  districtName?: string;

  @Prop()
  stateName?: string;

  @Prop()
  countryName?: string;

  @Prop()
  postalCode?: string;

  // Resolved IDs
  @Prop()
  villageId?: string;

  @Prop()
  talukId?: string;

  @Prop()
  districtId?: string;

  @Prop()
  stateId?: string;

  @Prop()
  provider: string;

  @Prop({ type: Date, default: Date.now })
  resolvedAt: Date;
}

export const GeoBoundaryCacheSchema = SchemaFactory.createForClass(GeoBoundaryCache);
// Compound index to ensure uniqueness for coordinates
GeoBoundaryCacheSchema.index({ latitude: 1, longitude: 1 }, { unique: true });
