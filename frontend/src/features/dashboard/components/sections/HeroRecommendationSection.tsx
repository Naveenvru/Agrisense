import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboard.service';
import { GreetingData, RecommendationData } from '@/types/dashboard/Recommendation';
import { HeroRecommendationCard } from '@/components/cards/HeroRecommendationCard';
import { HeroRecommendationSkeleton } from '@/components/cards/skeletons/HeroRecommendationSkeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { useAuth } from '@/context/AuthContext';
import { MapPin } from 'lucide-react';

export function HeroRecommendationSection() {
  const { user } = useAuth();
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
      setGreeting({
        ...greetData,
        userName: user?.name || greetData.userName,
      });
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
      {recommendation ? <HeroRecommendationCard greeting={greeting} recommendation={recommendation} /> : (
        <div className="glass rounded-xl border border-border p-6">
          <h1 className="text-2xl font-bold text-text-primary">Good day, {greeting.userName}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-text-secondary"><MapPin className="h-4 w-4" />{greeting.location}</div>
          <p className="mt-4 text-sm text-text-secondary">No evidence-backed recommendation is available yet. Add farm and crop information, then run an analysis to receive a recommendation supported by recorded data.</p>
        </div>
      )}
    </section>
  );
}
