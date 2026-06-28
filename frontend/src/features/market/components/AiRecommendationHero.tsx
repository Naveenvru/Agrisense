import { AiMarketRecommendation } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { BrainCircuit, TrendingUp, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface AiRecommendationHeroProps {
  recommendation: AiMarketRecommendation;
}

export function AiRecommendationHero({ recommendation }: AiRecommendationHeroProps) {
  
  const getRiskIcon = () => {
    switch(recommendation.priority) {
      case 'Safe': return CheckCircle2;
      case 'Caution': return AlertTriangle;
      case 'High Risk': return AlertTriangle;
      case 'Critical': return ShieldAlert;
      default: return AlertTriangle;
    }
  };
  
  const RiskIcon = getRiskIcon();
  
  const borderClass = {
    'Safe': 'border-success',
    'Caution': 'border-warning',
    'High Risk': 'border-orange-500',
    'Critical': 'border-error',
  }[recommendation.priority];
  
  const bgClass = {
    'Safe': 'bg-success/5',
    'Caution': 'bg-warning/5',
    'High Risk': 'bg-orange-500/5',
    'Critical': 'bg-error/5',
  }[recommendation.priority];
  
  const textClass = {
    'Safe': 'text-success',
    'Caution': 'text-warning',
    'High Risk': 'text-orange-500',
    'Critical': 'text-error',
  }[recommendation.priority];

  return (
    <Card className={`glass border-l-4 ${borderClass} ${bgClass} relative overflow-hidden`}>
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 font-bold text-primary text-sm uppercase tracking-wider">
              <BrainCircuit className="w-5 h-5" />
              AI Primary Recommendation
            </div>
            
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-text-primary leading-tight">
              {recommendation.recommendation}
            </h2>
            
            <div className="space-y-2 pt-2">
              <div className="flex flex-col gap-1 text-sm text-text-secondary">
                <span className="font-semibold text-text-primary uppercase tracking-wider text-xs">Why?</span>
                <ul className="space-y-1 ml-4 list-disc marker:text-primary">
                  {recommendation.reason.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-2 text-sm pt-2">
                <span className="font-semibold text-text-primary uppercase tracking-wider text-xs">Expected Profit Diff:</span>
                <span className="flex items-center gap-1 font-bold text-success text-base bg-success/10 px-2 py-0.5 rounded border border-success/20">
                  <TrendingUp className="w-4 h-4" />
                  +₹{recommendation.expectedProfitDiff.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-3 min-w-[140px]">
            <div className={`px-3 py-1.5 rounded-md font-bold text-sm flex items-center gap-1.5 border ${textClass} border-current bg-background/50`}>
              <RiskIcon className="w-4 h-4" />
              {recommendation.priority}
            </div>
            <div className="bg-background/80 backdrop-blur border border-border/50 rounded-lg p-3 text-center w-full">
              <div className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-1">Confidence</div>
              <div className="text-3xl font-bold text-primary">{recommendation.confidence}%</div>
            </div>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
}
