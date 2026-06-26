import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GeoBoundaryCache, GeoBoundaryCacheSchema } from './geoboundary-cache.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GeoBoundaryCache.name, schema: GeoBoundaryCacheSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class GeoBoundaryMongoModule {}
