import { HourlyForecast } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { CloudRain, Sun, Cloud, Wind, CloudLightning } from 'lucide-react';

interface ForecastTimelineProps {
  forecast: HourlyForecast[];
}

export function ForecastTimeline({ forecast }: ForecastTimelineProps) {
  
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Rain': return CloudRain;
      case 'Storm': return CloudLightning;
      case 'Cloudy': return Cloud;
      case 'Sunny': return Sun;
      case 'Clear': return Sun;
      case 'Windy': return Wind;
      default: return Sun;
    }
  };

  return (
    <section>
      <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Hourly Agricultural Timeline</h2>
      <Card className="glass overflow-hidden">
        <CardContent className="p-0">
          <div className="flex overflow-x-auto custom-scrollbar snap-x snap-mandatory">
            {forecast.map((hour, idx) => {
              const Icon = getWeatherIcon(hour.condition);
              const isRainy = hour.condition === 'Rain' || hour.condition === 'Storm';
              
              return (
                <div 
                  key={idx} 
                  className="snap-start min-w-[160px] md:min-w-[180px] p-5 border-r border-border/50 flex flex-col items-center text-center group hover:bg-background/50 transition-colors"
                >
                  <div className="text-sm font-medium text-text-secondary mb-3">{hour.time}</div>
                  
                  <div className={`p-3 rounded-full mb-3 ${isRainy ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="text-xl font-bold text-text-primary mb-1">{hour.temperature}°C</div>
                  
                  <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-4">
                    <CloudRain className="w-3 h-3 text-info" />
                    {hour.rainProbability}%
                  </div>
                  
                  <div className="mt-auto w-full pt-3 border-t border-border/50">
                    <p className="text-xs font-bold text-primary leading-tight px-1">
                      {hour.recommendedAction}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
