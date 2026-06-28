import { useState, useEffect } from 'react';
import { MarketService } from '../services/MarketService';
import { 
  MarketOpportunity, MarketDecision, AiMarketRecommendation,
  PersonalizedCropInsight, HarvestIntelligence, RegionalProfit,
  DemandSupplyMetrics, MarketTrendAnalysis, MarketPerformanceMetrics,
  PricePredictionData, RecommendationHistoryItem, MarketAlert,
  CommodityDetail
} from '../types';

import { MarketHero } from './MarketHero';
import { MarketDecisionDashboard } from './MarketDecisionDashboard';
import { AiRecommendationHero } from './AiRecommendationHero';
import { PricePredictionPipeline } from './PricePredictionPipeline';
import { PersonalizedCropInsights } from './PersonalizedCropInsights';
import { CommodityCards } from './CommodityCards';
import { PriceChart } from './PriceChart';
import { HarvestIntelligenceCard } from './HarvestIntelligenceCard';
import { DemandSupplyVisualizer } from './DemandSupplyVisualizer';
import { MarketTrendCard } from './MarketTrendCard';
import { RegionalProfitComparison } from './RegionalProfitComparison';
import { CommodityPerformanceDashboard } from './CommodityPerformanceDashboard';
import { AlertBanner } from './AlertBanner';
import { AiRecommendationHistory } from './AiRecommendationHistory';
import { FutureMarketplacePlaceholders } from './FutureMarketplacePlaceholders';
import { MarketDrawer } from './MarketDrawer';
import { WeatherSkeleton } from '../../weather/components/ui/WeatherSkeleton'; // Reuse for now or create custom

export function MarketPage() {
  const [opportunity, setOpportunity] = useState<MarketOpportunity | null>(null);
  const [decision, setDecision] = useState<MarketDecision | null>(null);
  const [aiRec, setAiRec] = useState<AiMarketRecommendation | null>(null);
  const [insights, setInsights] = useState<PersonalizedCropInsight[]>([]);
  const [harvest, setHarvest] = useState<HarvestIntelligence | null>(null);
  const [regional, setRegional] = useState<RegionalProfit[]>([]);
  const [demandSupply, setDemandSupply] = useState<DemandSupplyMetrics | null>(null);
  const [trends, setTrends] = useState<MarketTrendAnalysis[]>([]);
  const [performance, setPerformance] = useState<MarketPerformanceMetrics | null>(null);
  const [commodities, setCommodities] = useState<CommodityDetail[]>([]);
  const [alerts, setAlerts] = useState<MarketAlert[]>([]);
  const [history, setHistory] = useState<RecommendationHistoryItem[]>([]);
  const [chart, setChart] = useState<PricePredictionData[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedCommodity, setSelectedCommodity] = useState<CommodityDetail | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [
          opp, dec, ai, ins, harv, reg, ds, tr, perf, com, alts, hist, ch
        ] = await Promise.all([
          MarketService.getOpportunityScore(),
          MarketService.getMarketDecision(),
          MarketService.getAiRecommendation(),
          MarketService.getPersonalizedInsights(),
          MarketService.getHarvestIntelligence(),
          MarketService.getRegionalProfits(),
          MarketService.getDemandSupply(),
          MarketService.getMarketTrends(),
          MarketService.getPerformanceMetrics(),
          MarketService.getCommodities(),
          MarketService.getAlerts(),
          MarketService.getTimeline(),
          MarketService.getPriceChart()
        ]);

        setOpportunity(opp);
        setDecision(dec);
        setAiRec(ai);
        setInsights(ins);
        setHarvest(harv);
        setRegional(reg);
        setDemandSupply(ds);
        setTrends(tr);
        setPerformance(perf);
        setCommodities(com);
        setAlerts(alts);
        setHistory(hist);
        setChart(ch);
      } catch (e) {
        console.error("Failed to load market data", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading || !opportunity || !decision || !aiRec || !harvest || !demandSupply || !performance) {
    return <WeatherSkeleton />; // Reusing skeleton structure
  }

  return (
    <div className="space-y-8 pb-20 md:pb-6">
      
      {/* Alerts */}
      <AlertBanner alerts={alerts} />
      
      {/* Top Level Hero */}
      <MarketHero opportunity={opportunity} />
      
      {/* Quick Decisions */}
      <MarketDecisionDashboard decision={decision} />
      
      {/* Primary AI Recommendation */}
      <AiRecommendationHero recommendation={aiRec} />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Main Content (Left / Span 2) */}
        <div className="lg:col-span-2 space-y-10">
          
          <PersonalizedCropInsights insights={insights} />
          
          <CommodityCards commodities={commodities} onSelect={setSelectedCommodity} />
          
          <PriceChart data={chart} />
          
          <PricePredictionPipeline />
          
          <HarvestIntelligenceCard data={harvest} />
          
          <DemandSupplyVisualizer metrics={demandSupply} />
          
          <CommodityPerformanceDashboard metrics={performance} />

        </div>
        
        {/* Sidebar (Right / Span 1) */}
        <div className="space-y-8 lg:sticky lg:top-6">
          
          <RegionalProfitComparison markets={regional} />
          
          <MarketTrendCard trends={trends} />
          
          <AiRecommendationHistory history={history} />
          
          <FutureMarketplacePlaceholders />

        </div>
      </div>

      <MarketDrawer 
        commodity={selectedCommodity} 
        isOpen={!!selectedCommodity} 
        onClose={() => setSelectedCommodity(null)} 
      />

    </div>
  );
}
