import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IMarketCache } from '../../market/interfaces/market.interface';

export type MarketCacheDocument = MarketCache & Document;

/**
 * market_cache — Short-lived cache entries for frequently-queried market data.
 * TTL index automatically purges stale entries.
 */
@Schema({ timestamps: true, collection: 'market_cache' })
export class MarketCache implements IMarketCache {
  /** Composite key: e.g. "prices:Rice:Bengaluru APMC:2026-06-26" */
  @Prop({ required: true, unique: true, index: true })
  key: string;

  /** Serialized JSON of the cached value */
  @Prop({ required: true })
  data: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ required: true })
  source: string;
}

export const MarketCacheSchema = SchemaFactory.createForClass(MarketCache);

// MongoDB TTL index — auto-deletes documents after expiry
MarketCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
