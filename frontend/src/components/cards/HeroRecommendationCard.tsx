
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecommendationData, GreetingData } from '@/types/dashboard/Recommendation';
import { Sparkles, MapPin, Clock } from 'lucide-react';

interface HeroRecommendationCardProps {
  greeting: GreetingData;
  recommendation: RecommendationData;
}

export function HeroRecommendationCard({ greeting, recommendation }: HeroRecommendationCardProps) {
  return (
    <Card className="glass hover-card overflow-hidden relative w-full border-primary/20">
      {/* Decorative background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-surface to-background z-0" />
      
      <CardContent className="p-8 relative z-10 flex flex-col md:flex-row items-start justify-between gap-8">
        <div className="space-y-6 flex-1">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
              Good Morning, {greeting.userName}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Analyzed {greeting.lastAnalysisTime}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {greeting.location}</span>
            </div>
            <p className="mt-2 text-text-primary/80">{greeting.weatherSummary}</p>
          </div>

          <div className="bg-surface/50 border border-primary/20 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-heading font-semibold text-primary">Today's Intelligence</span>
            </div>
            <h2 className="text-xl font-medium text-text-primary mb-2">{recommendation.title}</h2>
            <p className="text-text-secondary mb-6 leading-relaxed max-w-3xl">
              {recommendation.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Sparkles className="w-4 h-4" />
                {recommendation.primaryActionText}
              </Button>
              <Button variant="outline" className="border-border">
                {recommendation.secondaryActionText}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto shrink-0">
          <div className="bg-surface/50 border border-border rounded-xl p-6 text-center backdrop-blur-sm">
            <div className="text-sm text-text-secondary mb-1">AI Confidence</div>
            <div className="text-4xl font-heading font-bold text-primary">{recommendation.confidence}%</div>
          </div>
          <div className="bg-surface/50 border border-border rounded-xl p-6 text-center backdrop-blur-sm">
            <div className="text-sm text-text-secondary mb-1">Expected Profit</div>
            <div className="text-3xl font-heading font-bold text-secondary">{recommendation.expectedProfitImpact}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
