import { FarmDashboardSummaryStats } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Sprout, Map, Target, Sun, CheckCircle } from 'lucide-react';

interface FarmDashboardSummaryProps {
  stats: FarmDashboardSummaryStats;
}

export function FarmDashboardSummary({ stats }: FarmDashboardSummaryProps) {
  const items = [
    { label: 'Total Farms', value: stats.totalFarms, icon: Map, color: 'text-primary' },
    { label: 'Total Area', value: `${stats.totalLandArea} ha`, icon: Target, color: 'text-secondary' },
    { label: 'Active Parcels', value: stats.totalActiveParcels, icon: Map, color: 'text-info' },
    { label: 'Active Crops', value: stats.activeCrops, icon: Sprout, color: 'text-success' },
    { label: 'Harvests This Month', value: stats.harvestsThisMonth, icon: Sun, color: 'text-warning' },
    { label: 'Healthy Farms', value: `${stats.healthyFarmsPercentage}%`, icon: CheckCircle, color: 'text-primary' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {items.map((item, index) => (
        <Card key={index} className="glass">
          <CardContent className="p-4 flex flex-col items-center text-center justify-center space-y-2">
            <div className={`p-2 rounded-full bg-background/50 ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-text-primary">{item.value}</p>
              <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">{item.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
