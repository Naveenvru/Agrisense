import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupplyAnalyticsDocument, SupplyAnalyticsSchema } from './supply-analytics.schema';
import { SupplyHistoryDocument, SupplyHistorySchema } from './supply-history.schema';
import { SupplyIntelligenceDocument, SupplyIntelligenceSchema } from './supply-intelligence.schema';
import { SupplyMongoService } from './supply-mongo.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupplyIntelligenceDocument.name, schema: SupplyIntelligenceSchema },
      { name: SupplyHistoryDocument.name, schema: SupplyHistorySchema },
      { name: SupplyAnalyticsDocument.name, schema: SupplyAnalyticsSchema },
    ]),
  ],
  providers: [SupplyMongoService],
  exports: [SupplyMongoService, MongooseModule],
})
export class SupplyMongoModule {}