import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketModule } from '../market/market.module';
import { DecisionTrace } from './decision-trace.entity';
import { DecisionCenterController } from './decision-center.controller';
import { DecisionCenterService } from './decision-center.service';

@Module({ imports: [TypeOrmModule.forFeature([DecisionTrace]), MarketModule], controllers: [DecisionCenterController], providers: [DecisionCenterService] })
export class DecisionCenterModule {}
