import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MarketService } from '../market/market.service';
import { WeatherService } from '../weather/weather.service';
import { DecisionTrace } from '../decision-center/decision-trace.entity';
import { GeneratedReport } from './report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { renderTextPdf } from './pdf-renderer';

const TITLE: Record<string, string> = { farm_performance: 'Farm Performance Report', market_intelligence: 'Market Intelligence Report', weather: 'Weather Report', crop_activity: 'Crop Activity Report', ai_analysis: 'AI Analysis Report' };

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(GeneratedReport) private readonly reports: Repository<GeneratedReport>,
    @InjectRepository(DecisionTrace) private readonly traces: Repository<DecisionTrace>,
    private readonly dataSource: DataSource,
    private readonly market: MarketService,
    private readonly weather: WeatherService,
  ) {}

  async history(userId: string) {
    const rows = await this.reports.find({ where: { userId }, order: { createdAt: 'DESC' }, take: 100 });
    return rows.map(({ id, reportType, reportTitle, periodStart, periodEnd, metadata, createdAt }) => ({ id, reportType, reportTitle, periodStart, periodEnd, metadata, createdAt }));
  }

  async generate(userId: string, dto: CreateReportDto) {
    const end = dto.endDate ? new Date(dto.endDate) : new Date();
    const start = dto.startDate ? new Date(dto.startDate) : new Date(end.getTime() - 30 * 86400000);
    if (start > end) throw new UnprocessableEntityException('startDate must be on or before endDate');
    if (dto.startDate) start.setUTCHours(0, 0, 0, 0);
    if (dto.endDate) end.setUTCHours(23, 59, 59, 999);
    const profileRows = await this.dataSource.query(`SELECT u.name, fp.district, fp.state FROM users u LEFT JOIN farmer_profiles fp ON fp.user_id = u.id WHERE u.id = $1`, [userId]);
    const profile = profileRows[0] || {};
    const lines = [`Farmer: ${profile.name || 'Not available'}`, `Region: ${[profile.district, profile.state].filter(Boolean).join(', ') || 'Not recorded'}`, `Reporting period: ${start.toISOString().slice(0, 10)} to ${end.toISOString().slice(0, 10)}`, `Generated: ${new Date().toISOString()}`, ''];
    const sources: string[] = [];
    let rowCount = 0;

    if (dto.reportType === 'farm_performance') {
      const rows = await this.dataSource.query(`SELECT lp.parcel_name, lp.area_acres, fc.crop_variety, c.crop_name, fc.sowing_date, fc.expected_harvest_date, fc.estimated_yield_kg, fc.actual_yield_kg, fc.status FROM farmer_profiles fp LEFT JOIN farmer_land_parcels lp ON lp.farmer_profile_id = fp.id LEFT JOIN farmer_crops fc ON fc.parcel_id = lp.id LEFT JOIN crops c ON c.id = fc.crop_id WHERE fp.user_id = $1 ORDER BY lp.created_at DESC`, [userId]);
      lines.push('Farm and crop records:');
      for (const row of rows.filter((item: any) => item.parcel_name || item.crop_name)) lines.push(`${row.parcel_name || 'Parcel'} | area ${row.area_acres ?? 'not recorded'} acres | crop ${row.crop_name || 'not recorded'} ${row.crop_variety || ''} | status ${row.status || 'not recorded'} | estimated yield kg ${row.estimated_yield_kg ?? 'not recorded'} | actual yield kg ${row.actual_yield_kg ?? 'not recorded'}`);
      rowCount = rows.filter((item: any) => item.parcel_name || item.crop_name).length; sources.push('PostgreSQL farmer profiles, parcels and registered crops');
    } else if (dto.reportType === 'crop_activity') {
      const rows = await this.dataSource.query(`SELECT ce.event_date, ce.task_name, ce.task_description, ce.is_completed, c.crop_name FROM calendar_events ce JOIN farmer_crops fc ON fc.id = ce.farmer_crop_id JOIN farmer_land_parcels lp ON lp.id = fc.parcel_id JOIN farmer_profiles fp ON fp.id = lp.farmer_profile_id LEFT JOIN crops c ON c.id = fc.crop_id WHERE fp.user_id = $1 AND ce.event_date BETWEEN $2 AND $3 ORDER BY ce.event_date`, [userId, start, end]);
      lines.push('Registered crop calendar activities:');
      rows.forEach((row: any) => lines.push(`${row.event_date} | ${row.crop_name || 'Crop not recorded'} | ${row.task_name} | ${row.is_completed ? 'completed' : 'pending'} | ${row.task_description || ''}`));
      rowCount = rows.length; sources.push('PostgreSQL registered crop calendar events');
    } else if (dto.reportType === 'market_intelligence') {
      const prices = await this.market.getPricesForUser(userId, { startDate: start, endDate: end, limit: 500 });
      lines.push('Recorded market price observations:');
      prices.forEach((row: any) => lines.push(`${new Date(row.date).toISOString().slice(0, 10)} | ${row.commodity} | ${row.market}, ${row.district}, ${row.state} | min ${row.minPrice} | modal ${row.modalPrice} | max ${row.maxPrice} ${row.unit} | source ${row.source}`));
      rowCount = prices.length; sources.push('MongoDB market_prices_v2');
    } else if (dto.reportType === 'weather') {
      const parcels = await this.dataSource.query(`SELECT lp.id, ST_Y(lp.location::geometry) AS latitude, ST_X(lp.location::geometry) AS longitude FROM farmer_land_parcels lp JOIN farmer_profiles fp ON fp.id = lp.farmer_profile_id WHERE fp.user_id = $1 AND lp.location IS NOT NULL ORDER BY lp.created_at DESC`, [userId]);
      if (parcels.length) {
        try {
          const observation = await this.weather.getCurrentWeather(parcels[0].id, userId);
          lines.push(`Current observation for parcel ${parcels[0].id}: ${observation.weatherDescription}; ${observation.temperature} C; humidity ${observation.humidity}%; rainfall ${observation.rainfall} mm; wind ${observation.windSpeed} m/s; pressure ${observation.pressure} hPa; observed ${observation.timestamp}; source ${observation.source}`);
          rowCount = 1; sources.push('OpenWeather observation/cache');
        } catch { lines.push('A current weather observation could not be retrieved for this parcel.'); }
      } else lines.push('No geolocated farm parcel is available for weather reporting.');
    } else if (dto.reportType === 'ai_analysis') {
      const rows = await this.traces.find({ where: { userId }, order: { createdAt: 'DESC' }, take: 50 });
      const withinPeriod = rows.filter((row) => row.createdAt >= start && row.createdAt <= end);
      lines.push('Recorded deterministic analysis traces:');
      withinPeriod.forEach((row) => lines.push(`Trace ${row.traceId} | ${row.createdAt.toISOString()} | ${row.status} | ${row.query} | ${String(row.result['answer'] || '')}`));
      rowCount = withinPeriod.length; sources.push('PostgreSQL decision_traces');
    }
    if (rowCount === 0) throw new NotFoundException(`No actual records are available for a ${TITLE[dto.reportType]} in the selected period.`);
    lines.push('', `Sources: ${sources.join('; ')}`, 'This report contains available recorded data for the selected period. It is not a guarantee or a future prediction.', `Records included: ${rowCount}`);
    const pdfContent = renderTextPdf(TITLE[dto.reportType], lines);
    const report = await this.reports.save(this.reports.create({ userId, reportType: dto.reportType, reportTitle: TITLE[dto.reportType], periodStart: start.toISOString().slice(0, 10), periodEnd: end.toISOString().slice(0, 10), metadata: { sources, rowCount }, pdfContent }));
    return { id: report.id, reportType: report.reportType, reportTitle: report.reportTitle, periodStart: report.periodStart, periodEnd: report.periodEnd, metadata: report.metadata, createdAt: report.createdAt };
  }

  async download(userId: string, id: string) {
    const report = await this.reports.findOne({ where: { id, userId } });
    if (!report) throw new NotFoundException('Report not found');
    return { filename: `agrisense-${report.reportType}-${report.id}.pdf`, content: report.pdfContent };
  }
}
