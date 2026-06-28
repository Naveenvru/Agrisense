import { DailyForecast } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { CloudRain, Sun, Cloud, Wind, Droplets } from 'lucide-react';

interface WeeklyForecastCardProps {
  forecast: DailyForecast[];
  onDayClick?: (day: DailyForecast) => void;
}

export function WeeklyForecastCard({ forecast, onDayClick }: WeeklyForecastCardProps) {
  
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Rain': return CloudRain;
      case 'Sunny': return Sun;
      case 'Cloudy': return Cloud;
      case 'Windy': return Wind;
      default: return Sun;
    }
  };

  return (
    <section>
      <h2 className="text-xl font-heading font-bold text-text-primary mb-4">7-Day Agricultural Outlook</h2>
      <Card className="glass overflow-hidden">
        <CardContent className="p-0 divide-y divide-border/50">
          {forecast.map((day, idx) => {
            const Icon = getWeatherIcon(day.condition);
            
            return (
              <div 
                key={idx} 
                onClick={() => onDayClick?.(day)}
                className={`p-5 flex flex-col lg:grid lg:grid-cols-12 lg:items-center gap-6 transition-colors ${
                  onDayClick ? 'cursor-pointer hover:bg-background/50' : ''
                }`}
              >
                {/* Left Section (Icon, Day, Condition) */}
                <div className="flex items-center gap-4 w-full lg:col-span-3">
                  <div className={`p-3 rounded-xl ${day.condition === 'Rain' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-text-primary">{day.date}</div>
                    <div className="text-sm font-medium text-text-secondary">{day.condition}</div>
                  </div>
                </div>

                {/* Center Section (Temps, Details) */}
                <div className="flex items-center justify-between lg:justify-around w-full lg:col-span-5 gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-text-secondary mb-1 uppercase tracking-wider font-semibold">Temp</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-primary text-lg">{day.maxTemp}°</span>
                      <div className="w-8 h-1.5 bg-border rounded-full overflow-hidden hidden sm:block">
                        <div className="h-full bg-gradient-to-r from-info to-warning w-full" />
                      </div>
                      <span className="font-medium text-text-secondary text-base">{day.minTemp}°</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm font-medium text-text-secondary">
                    <div className="flex flex-col items-center gap-1.5" title="Rain Probability">
                      <CloudRain className="w-4 h-4 text-info" />
                      <span>{day.rainProbability}%</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5" title="Humidity">
                      <Droplets className="w-4 h-4 text-primary" />
                      <span>{day.humidity}%</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5" title="Wind">
                      <Wind className="w-4 h-4" />
                      <span>{day.windSpeed}km/h</span>
                    </div>
                  </div>
                </div>

                {/* Right Section (Agricultural Impact) */}
                <div className="w-full lg:col-span-4 flex items-center lg:justify-end">
                  <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 w-full flex flex-col gap-1.5 hover:bg-primary/10 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-xs uppercase font-bold text-primary tracking-wider">Action</span>
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">High Conf</span>
                    </div>
                    <div className="text-sm font-semibold text-text-primary leading-tight">
                      {day.agriculturalImpact}
                    </div>
                  </div>
                </div>
                
              </div>
            );
          })}
        </CardContent>
      </Card>
    </section>
  );
}
