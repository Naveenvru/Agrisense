import { Farm } from '../types';
import { FarmCard } from './FarmCard';
import { EmptyState } from './ui/EmptyState';
import { Map, AlertCircle } from 'lucide-react';

interface FarmListProps {
  farms: Farm[];
  isLoading: boolean;
  error: Error | null;
  viewMode: 'grid' | 'list';
  selectedFarmId?: string | null;
  onFarmClick: (id: string) => void;
}

export function FarmList({ farms, isLoading, error, viewMode, selectedFarmId, onFarmClick }: FarmListProps) {
  if (error) {
    return (
      <div className="py-12">
        <EmptyState 
          icon={AlertCircle} 
          title="Failed to load farms" 
          description="There was an error loading your farm data. Please try again." 
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`animate-pulse bg-muted rounded-xl ${viewMode === 'grid' ? 'h-64' : 'h-32'}`}></div>
        ))}
      </div>
    );
  }

  if (farms.length === 0) {
    return (
      <div className="py-12">
        <EmptyState 
          icon={Map} 
          title="No Farms Found" 
          description="You don't have any farms matching your criteria. Add a new farm to get started." 
        />
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
      {farms.map(farm => (
        <FarmCard 
          key={farm.id} 
          farm={farm} 
          viewMode={viewMode} 
          isSelected={farm.id === selectedFarmId}
          onClick={onFarmClick} 
        />
      ))}
    </div>
  );
}
