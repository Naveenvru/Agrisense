import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DemandAnalyticsDocument, DemandAnalyticsSchema } from './demand-analytics.schema';
import { DemandHistoryDocument, DemandHistorySchema } from './demand-history.schema';
import { DemandIntelligenceDocument, DemandIntelligenceSchema } from './demand-intelligence.schema';
import { DemandMongoService } from './demand-mongo.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DemandIntelligenceDocument.name, schema: DemandIntelligenceSchema },
      { name: DemandHistoryDocument.name, schema: DemandHistorySchema },
      { name: DemandAnalyticsDocument.name, schema: DemandAnalyticsSchema },
    ]),
  ],
  providers: [DemandMongoService],
  exports: [DemandMongoService, MongooseModule],
})
export class DemandMongoModule {}
