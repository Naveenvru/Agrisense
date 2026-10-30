import { Farm } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Sprout, Home, ChevronRight } from 'lucide-react';
import { HealthBadge, GrowthStageBadge, AreaBadge, HarvestCountdown } from './ui/badges';
import { ActionMenu } from './ui/ActionMenu';

interface FarmCardProps {
  farm: Farm;
  viewMode: 'grid' | 'list';
  isSelected?: boolean;
  onClick: (farmId: string) => void;
}

export function FarmCard({ farm, viewMode, isSelected, onClick }: FarmCardProps) {
  return (
    <Card 
      className={`glass transition-all cursor-pointer group ${
        isSelected ? 'border-primary shadow-lg shadow-primary/10 bg-primary/5' : 'hover:border-primary/50 bg-background/50'
      } ${
        viewMode === 'list' ? 'flex flex-row items-center gap-4' : 'flex flex-col'
      }`}
      onClick={() => onClick(farm.id)}
    >
      <CardContent className={`p-6 flex-1 ${viewMode === 'list' ? 'flex items-center gap-6 py-4' : 'flex flex-col gap-5'}`}>
        
        {/* Header & Menu */}
        <div className={`flex justify-between items-start ${viewMode === 'list' ? 'w-1/4' : 'w-full'}`}>
          <div className="flex gap-3 items-start">
            <div className={`p-2 rounded-lg mt-1 ${isSelected ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-2xl font-heading font-bold text-text-primary group-hover:text-primary transition-colors tracking-tight">
                {farm.name}
              </h3>
              <p className="text-sm text-text-secondary flex items-center gap-1.5 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5" />
                {farm.location}
              </p>
            </div>
          </div>
          <ActionMenu onViewDetails={() => onClick(farm.id)} />
        </div>

        {/* Badges Container */}
        <div className={`flex flex-wrap gap-2 ${viewMode === 'list' ? 'flex-1' : 'w-full'}`}>
          <AreaBadge area={farm.totalArea} />
          <HealthBadge status={farm.overallHealthStatus} />
          {farm.growthStage && <GrowthStageBadge stage={farm.growthStage} />}
        </div>

        {/* Current Crop & Harvest Info */}
        <div className={`flex flex-col gap-3 ${viewMode === 'list' ? 'w-1/3' : 'w-full'}`}>
          {farm.currentCrop ? (
            <>
              <div className="flex items-center gap-2 text-base text-text-primary">
                <Sprout className="w-5 h-5 text-primary" />
                <span className="font-medium">{farm.currentCrop}</span>
                <span className="text-text-secondary">({farm.cropVariety})</span>
              </div>
              {farm.expectedHarvestDate && <HarvestCountdown dateString={farm.expectedHarvestDate} />}
            </>
          ) : (
            <div className="text-sm text-text-secondary italic">No active crops</div>
          )}
        </div>

        {/* Footer (Grid only for spacing reasons, or small in list) */}
        {viewMode === 'grid' && (
          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs">
              <span className="text-text-secondary/60">{farm.lastUpdated ? `Updated ${new Date(farm.lastUpdated).toLocaleDateString()}` : 'Update time unavailable'}</span>
              <div className="flex items-center gap-1 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                View <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
