import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { CalendarFilterState } from '../types';

interface CalendarToolbarProps {
  viewMode: 'month' | 'week' | 'day';
  onViewModeChange: (mode: 'month' | 'week' | 'day') => void;
  filters: CalendarFilterState;
  onFilterChange: (filters: CalendarFilterState) => void;
}

export function CalendarToolbar({ viewMode, onViewModeChange, filters, onFilterChange }: CalendarToolbarProps) {
  
  const handleSearchChange = (search: string) => {
    onFilterChange({ ...filters, search });
  };

  const handleChipClick = (key: keyof CalendarFilterState, value: string) => {
    const current = filters[key];
    onFilterChange({ ...filters, [key]: current === value ? 'all' : value });
  };

  const FilterChip = ({ label, filterKey, value }: { label: string, filterKey: keyof CalendarFilterState, value: string }) => {
    const isActive = filters[filterKey] === value;
    return (
      <button
        onClick={() => handleChipClick(filterKey, value)}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border whitespace-nowrap ${
          isActive 
            ? 'bg-primary text-primary-foreground border-primary' 
            : 'bg-background/50 text-text-secondary border-border hover:border-primary/50 hover:text-primary'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      
      {/* Top row: Search and View Mode */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-[480px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input 
            placeholder="Search tasks, farms, crops..." 
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-10 bg-background/50 border-border focus:ring-2 focus:ring-primary/20 transition-all rounded-lg text-base md:text-sm"
          />
        </div>

        <div className="flex items-center bg-background/80 backdrop-blur rounded-lg border border-border p-1 w-full md:w-auto">
          <button
            onClick={() => onViewModeChange('month')}
            className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'month' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-hover'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => onViewModeChange('week')}
            className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'week' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-hover'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => onViewModeChange('day')}
            className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'day' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-hover'
            }`}
          >
            Day
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        <div className="flex items-center gap-1.5 text-text-secondary mr-2">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        {/* Status */}
        <FilterChip label="Pending" filterKey="status" value="Pending" />
        <FilterChip label="In Progress" filterKey="status" value="In Progress" />
        <FilterChip label="Overdue" filterKey="status" value="Overdue" />
        <FilterChip label="Completed" filterKey="status" value="Completed" />
        
        <div className="w-px h-5 bg-border mx-1 hidden sm:block" />
        
        {/* Priority */}
        <FilterChip label="Critical Priority" filterKey="priority" value="Critical" />
        <FilterChip label="High Priority" filterKey="priority" value="High" />
        
        <div className="w-px h-5 bg-border mx-1 hidden sm:block" />
        
        {/* Crop (Examples) */}
        <FilterChip label="Tomato" filterKey="crop" value="Tomato" />
        <FilterChip label="Paddy" filterKey="crop" value="Paddy" />
      </div>

    </div>
  );
}
