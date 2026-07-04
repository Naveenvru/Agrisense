import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HarvestIntelligenceDocument,
  HarvestIntelligenceSchema,
} from './harvest-intelligence.schema';
import { HarvestHistoryDocument, HarvestHistorySchema } from './harvest-history.schema';
import {
  HarvestAnalyticsDocument,
  HarvestAnalyticsSchema,
} from './harvest-analytics.schema';
import { HarvestMongoService } from './harvest-mongo.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HarvestIntelligenceDocument.name, schema: HarvestIntelligenceSchema },
      { name: HarvestHistoryDocument.name, schema: HarvestHistorySchema },
      { name: HarvestAnalyticsDocument.name, schema: HarvestAnalyticsSchema },
    ]),
  ],
  providers: [HarvestMongoService],
  exports: [HarvestMongoService, MongooseModule],
})
export class HarvestMongoModule {}
