import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FarmData } from '@/types/dashboard/Farm';
import { Leaf, Droplets, Calendar, ChevronRight } from 'lucide-react';

interface FarmCardProps {
  farm: FarmData;
}

export function FarmCard({ farm }: FarmCardProps) {
  const getStatusColor = (status: FarmData['status']) => {
    switch (status) {
      case 'Healthy': return 'bg-primary/20 text-primary border-primary/20';
      case 'Attention Required': return 'bg-warning/20 text-warning border-warning/50';
      case 'Critical': return 'bg-error/20 text-error border-error/50';
      default: return 'bg-surface text-text-secondary';
    }
  };

  return (
    <Card className="glass hover-card hover:border-primary/30 transition-colors group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-heading font-medium text-text-primary">{farm.name}</h3>
            <p className="text-sm text-text-secondary">{farm.area} ha</p>
          </div>
          <Badge variant="outline" className={getStatusColor(farm.status)}>
            {farm.status}
          </Badge>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <Leaf className="w-4 h-4 text-primary" />
            <span className="text-text-secondary w-24">Crop:</span>
            <span className="font-medium text-text-primary">{farm.crop}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Droplets className="w-4 h-4 text-secondary" />
            <span className="text-text-secondary w-24">Stage:</span>
            <span className="font-medium text-text-primary">{farm.growthStage}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-warning" />
            <span className="text-text-secondary w-24">Harvest In:</span>
            <span className="font-medium text-text-primary">{farm.harvestCountdownDays} days</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-text-secondary">Health Score</span>
            <span className="font-medium">{farm.healthScore}/100</span>
          </div>
          <div className="w-full bg-surface rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${farm.healthScore > 80 ? 'bg-primary' : farm.healthScore > 50 ? 'bg-warning' : 'bg-error'}`} 
              style={{ width: `${farm.healthScore}%` }}
            />
          </div>
        </div>

        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
          View Details <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
