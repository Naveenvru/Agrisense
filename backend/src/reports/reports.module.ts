import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketModule } from '../market/market.module';
import { WeatherModule } from '../weather/weather.module';
import { DecisionTrace } from '../decision-center/decision-trace.entity';
import { GeneratedReport } from './report.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({ imports: [TypeOrmModule.forFeature([GeneratedReport, DecisionTrace]), MarketModule, WeatherModule], controllers: [ReportsController], providers: [ReportsService] })
export class ReportsModule {}
