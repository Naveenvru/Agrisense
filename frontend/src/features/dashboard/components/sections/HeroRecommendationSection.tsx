import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboard.service';
import { GreetingData, RecommendationData } from '@/types/dashboard/Recommendation';
import { HeroRecommendationCard } from '@/components/cards/HeroRecommendationCard';
import { HeroRecommendationSkeleton } from '@/components/cards/skeletons/HeroRecommendationSkeleton';
import { ErrorState } from '@/components/common/ErrorState';

export function HeroRecommendationSection() {
  const [greeting, setGreeting] = useState<GreetingData | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [greetData, recData] = await Promise.all([
        dashboardService.getGreeting(),
        dashboardService.getRecommendation()
      ]);
      setGreeting(greetData);
      setRecommendation(recData);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) return <HeroRecommendationSkeleton />;
  
  if (error) return (
    <ErrorState 
      title="Failed to load intelligence" 
      message={error.message || "Could not fetch today's AI recommendation."} 
      onRetry={loadData} 
    />
  );

  if (!greeting || !recommendation) return null; // No EmptyState needed here usually, just fall through if null

  return (
    <section>
      <HeroRecommendationCard greeting={greeting} recommendation={recommendation} />
    </section>
  );
}
