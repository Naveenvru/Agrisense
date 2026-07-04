import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { YieldAnalyticsDocument, YieldAnalyticsSchema } from './yield-analytics.schema';
import { YieldHistoryDocument, YieldHistorySchema } from './yield-history.schema';
import { YieldIntelligenceDocument, YieldIntelligenceSchema } from './yield-intelligence.schema';
import { YieldMongoService } from './yield-mongo.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: YieldIntelligenceDocument.name, schema: YieldIntelligenceSchema },
      { name: YieldHistoryDocument.name, schema: YieldHistorySchema },
      { name: YieldAnalyticsDocument.name, schema: YieldAnalyticsSchema },
    ]),
  ],
  providers: [YieldMongoService],
  exports: [YieldMongoService, MongooseModule],
})
export class YieldMongoModule {}
