import { Button } from '@/components/ui/button';

interface FilterChip {
  id: string;
  label: string;
}

interface FilterChipsProps {
  filters: FilterChip[];
  activeFilter: string;
  onChange: (id: string) => void;
}

export function FilterChips({ filters, activeFilter, onChange }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(filter.id)}
          className={`rounded-full ${
            activeFilter === filter.id 
              ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
              : 'bg-background hover:bg-muted text-text-secondary border-border'
          }`}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
