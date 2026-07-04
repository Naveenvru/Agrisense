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

  /**
   * Optional GeoJSON Feature containing the administrative boundary polygon.
   * Stored as a raw Object to accommodate both Polygon and MultiPolygon geometries.
   * Populated only when a boundary polygon is explicitly requested and fetched.
   */
  @Prop({ type: Object })
  boundaryPolygon?: Record<string, any>;

  @Prop()
  provider: string;

  /**
   * Discriminator key for polygon-only cache entries.
   * Format: `${adminLevel}:${name.toLowerCase()}` (e.g. `district:bengaluru urban`).
   * Absent on coordinate-based lookup entries.
   */
  @Prop({ type: String })
  polygonCacheKey?: string;

  @Prop({ type: Date, default: Date.now })
  resolvedAt: Date;
}

export const GeoBoundaryCacheSchema = SchemaFactory.createForClass(GeoBoundaryCache);
// Compound index to ensure uniqueness for coordinates
GeoBoundaryCacheSchema.index({ latitude: 1, longitude: 1 }, { unique: true });
// Sparse index for polygon-only cache documents (adminLevel:name key)
GeoBoundaryCacheSchema.index({ polygonCacheKey: 1 }, { unique: true, sparse: true });


