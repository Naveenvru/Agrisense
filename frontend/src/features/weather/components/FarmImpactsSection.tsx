import { FarmWeatherImpact, CropWeatherImpact } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Sprout, ArrowRight } from 'lucide-react';

interface FarmImpactsProps {
  farmImpacts: FarmWeatherImpact[];
  cropImpacts: CropWeatherImpact[];
}

export function FarmImpactsSection({ farmImpacts, cropImpacts }: FarmImpactsProps) {
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Safe': return 'text-success bg-success/10 border-success/30';
      case 'Caution': return 'text-warning bg-warning/10 border-warning/30';
      case 'High Risk': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'Critical': return 'text-error bg-error/10 border-error/30';
      default: return 'text-secondary bg-secondary/10 border-secondary/30';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Farm Impact */}
      <section>
        <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Farm Weather Intelligence</h2>
        <div className="space-y-3">
          {farmImpacts.map(farm => (
            <Card key={farm.farmId} className="glass border-l-4 border-primary">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-text-primary font-bold mb-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    {farm.farmName}
                  </div>
                  <div className="text-sm font-medium text-text-secondary">
                    {farm.condition}
                  </div>
                </div>
                
                <ArrowRight className="w-4 h-4 text-text-secondary hidden sm:block opacity-50" />
                
                <div className="bg-primary/5 rounded-lg p-3 sm:w-1/2 border border-primary/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs uppercase tracking-wider font-semibold text-text-secondary">Action Required</span>
                    <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10">{farm.confidence}% Conf</span>
                  </div>
                  <div className="text-sm font-bold text-primary">{farm.impact}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Crop Impact */}
      <section>
        <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Crop-Specific Impact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cropImpacts.map((crop, idx) => {
            const colorClass = getStatusColor(crop.status);
            
            return (
              <Card key={idx} className="glass">
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 font-bold text-text-primary">
                      <Sprout className="w-4 h-4 text-primary" />
                      {crop.crop}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${colorClass}`}>
                      {crop.status}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mt-auto">{crop.impactDescription}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

    </div>
  );
}
