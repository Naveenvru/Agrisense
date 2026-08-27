import { useQuery } from '@tanstack/react-query';
import { aiService } from '../services/ai.service';
import { ExplainableDecisionData } from '../types';

export const useDecisionIntelligence = (farmerCropId?: string) => {
  return useQuery<ExplainableDecisionData, Error>({
    queryKey: ['decision-intelligence', farmerCropId],
    queryFn: () => aiService.getDecisionIntelligence(farmerCropId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
