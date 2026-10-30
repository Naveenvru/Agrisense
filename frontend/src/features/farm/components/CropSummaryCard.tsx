import { CropSummary } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { HealthBadge, GrowthStageBadge, AreaBadge, HarvestCountdown } from './ui/badges';
import { Sprout, Scale } from 'lucide-react';

interface CropSummaryCardProps {
  crop: CropSummary;
}

export function CropSummaryCard({ crop }: CropSummaryCardProps) {
  return (
    <Card className="glass">
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-text-primary leading-tight">{crop.name || 'Crop name not recorded'}</h4>
              {crop.variety && <p className="text-sm text-text-secondary">{crop.variety}</p>}
            </div>
          </div>
          {crop.area !== null && crop.area !== undefined && <AreaBadge area={crop.area} />}
        </div>
        
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          {crop.currentStage && <GrowthStageBadge stage={crop.currentStage} />}
          <HealthBadge status={crop.healthStatus} />
        </div>
        
        <div className="flex flex-col gap-2 pt-2">
          {crop.expectedHarvestDate && <HarvestCountdown dateString={crop.expectedHarvestDate} />}
          {crop.estimatedYield !== null && crop.estimatedYield !== undefined && <div className="flex items-center gap-2 text-sm text-text-secondary bg-background/50 p-2 rounded border border-border">
            <Scale className="w-4 h-4 text-warning" />
            <span>Est. Yield: <span className="font-semibold text-text-primary">{crop.estimatedYield} {crop.yieldUnit}</span></span>
          </div>}
        </div>
      </CardContent>
    </Card>
  );
}
