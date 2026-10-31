import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSettings } from '../settings/user-settings.entity';
import { MarketModule } from '../market/market.module';
import { AiController } from './ai.controller';
import { AiGatewayService } from './ai-gateway.service';
import { CommodityMcpClient } from './mcp/commodity-mcp.client';
import { OpenAiService } from './openai.service';
import { IntentRouterService } from './routing/intent-router.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserSettings]), MarketModule],
  controllers: [AiController],
  providers: [AiGatewayService, CommodityMcpClient, OpenAiService, IntentRouterService],
})
export class AiModule {}
