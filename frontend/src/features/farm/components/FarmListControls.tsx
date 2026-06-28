import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LayoutGrid, List as ListIcon, SlidersHorizontal } from 'lucide-react';
import { FilterChips } from './ui/FilterChips';

interface FarmListControlsProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  activeFilter: string;
  onFilterChange: (val: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const filters = [
  { id: 'all', label: 'All Farms' },
  { id: 'healthy', label: 'Healthy' },
  { id: 'attention', label: 'Needs Attention' },
  { id: 'harvest', label: 'Harvest Ready' },
];

export function FarmListControls({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  viewMode,
  onViewModeChange
}: FarmListControlsProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-[480px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input 
            placeholder="Search farms, crops, locations..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 bg-background/50 border-border focus:ring-2 focus:ring-primary/20 transition-all rounded-lg text-base md:text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <Button variant="outline" size="sm" className="gap-2 bg-background/50">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Sort</span>
          </Button>
          <div className="flex bg-background/50 rounded-md p-1 border border-border">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`px-2 py-1 h-8 ${viewMode === 'grid' ? 'bg-primary/20 text-primary' : 'text-text-secondary'}`}
              onClick={() => onViewModeChange('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`px-2 py-1 h-8 ${viewMode === 'list' ? 'bg-primary/20 text-primary' : 'text-text-secondary'}`}
              onClick={() => onViewModeChange('list')}
            >
              <ListIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <FilterChips filters={filters} activeFilter={activeFilter} onChange={onFilterChange} />
    </div>
  );
}
