import { Farm } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, CloudSun, MapPin, Sprout } from 'lucide-react';
import { HealthBadge, GrowthStageBadge, AreaBadge, HarvestCountdown } from './ui/badges';

interface FarmCardProps {
  farm: Farm;
  viewMode: 'grid' | 'list';
  onClick: (farmId: string) => void;
}

export function FarmCard({ farm, viewMode, onClick }: FarmCardProps) {
  return (
    <Card 
      className={`glass hover:border-primary/50 transition-all cursor-pointer group ${
        viewMode === 'list' ? 'flex flex-row items-center gap-4' : 'flex flex-col'
      }`}
      onClick={() => onClick(farm.id)}
    >
      <CardContent className={`p-5 flex-1 ${viewMode === 'list' ? 'flex items-center gap-6 py-4' : 'flex flex-col gap-4'}`}>
        
        {/* Header & Menu */}
        <div className={`flex justify-between items-start ${viewMode === 'list' ? 'w-1/4' : 'w-full'}`}>
          <div>
            <h3 className="text-xl font-heading font-semibold text-text-primary group-hover:text-primary transition-colors">
              {farm.name}
            </h3>
            <p className="text-sm text-text-secondary flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {farm.location}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
            <MoreVertical className="w-4 h-4 text-text-secondary" />
          </Button>
        </div>

        {/* Badges Container */}
        <div className={`flex flex-wrap gap-2 ${viewMode === 'list' ? 'flex-1' : 'w-full'}`}>
          <AreaBadge area={farm.totalArea} />
          <HealthBadge status={farm.overallHealthStatus} />
          {farm.growthStage && <GrowthStageBadge stage={farm.growthStage} />}
        </div>

        {/* Current Crop & Harvest Info */}
        <div className={`flex flex-col gap-2 ${viewMode === 'list' ? 'w-1/3' : 'w-full'}`}>
          {farm.currentCrop ? (
            <>
              <div className="flex items-center gap-2 text-sm text-text-primary">
                <Sprout className="w-4 h-4 text-primary" />
                <span className="font-medium">{farm.currentCrop}</span>
                <span className="text-text-secondary">({farm.cropVariety})</span>
              </div>
              {farm.expectedHarvestDate && <HarvestCountdown dateString={farm.expectedHarvestDate} />}
            </>
          ) : (
            <div className="text-sm text-text-secondary italic">No active crops</div>
          )}
        </div>

        {/* Weather Preview (Grid only for spacing reasons, or small in list) */}
        {viewMode === 'grid' && (
          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <CloudSun className="w-4 h-4 text-info" />
              <span>24°C, Sunny</span>
            </div>
            <div className="text-xs text-text-secondary">
              Updated 2h ago
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
