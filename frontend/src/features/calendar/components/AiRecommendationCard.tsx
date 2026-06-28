import { AiRecommendation } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';

interface AiRecommendationCardProps {
  recommendation?: AiRecommendation;
}

export function AiRecommendationCard({ recommendation }: AiRecommendationCardProps) {
  if (!recommendation) {
    return (
      <Card className="glass border-primary/20 bg-primary/5">
        <CardContent className="p-5 flex flex-col items-center justify-center text-center space-y-3 min-h-[160px]">
          <div className="p-3 bg-primary/10 rounded-full">
            <BrainCircuit className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-text-primary font-medium">AgriSense AI Analysis</p>
            <p className="text-sm text-text-secondary mt-1">Recommendations will appear here after AI analysis.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-primary/30 bg-primary/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <BrainCircuit className="w-5 h-5" />
            Today's AI Recommendation
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            {recommendation.confidence}% Match
          </div>
        </div>
        
        <h4 className="text-lg font-heading font-bold text-text-primary mb-2 leading-tight">
          {recommendation.suggestion}
        </h4>
        
        <div className="mt-4 pt-3 border-t border-primary/10">
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wider block mb-1">Reason</span>
          <p className="text-sm text-text-primary/90">{recommendation.reason}</p>
        </div>
      </CardContent>
    </Card>
  );
}
