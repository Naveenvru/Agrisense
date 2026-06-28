import { Card, CardContent } from '@/components/ui/card';
import { WeatherData } from '@/types/dashboard/Weather';
import { CloudRain, Wind, Droplets, Thermometer, AlertTriangle } from 'lucide-react';

interface WeatherCardProps {
  weather: WeatherData;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <Card className="glass hover-card h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
        <CloudRain className="w-32 h-32" />
      </div>
      <CardContent className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-sm font-medium text-text-secondary mb-1">Current Conditions</h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-heading font-bold text-text-primary">{weather.temperature}°</span>
              <span className="text-lg text-text-secondary mb-1">{weather.condition}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-secondary" />
            <div>
              <div className="text-xs text-text-secondary">Humidity</div>
              <div className="text-sm font-medium">{weather.humidity}%</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-text-secondary" />
            <div>
              <div className="text-xs text-text-secondary">Wind</div>
              <div className="text-sm font-medium">{weather.windSpeed} km/h</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-primary" />
            <div>
              <div className="text-xs text-text-secondary">Rainfall</div>
              <div className="text-sm font-medium">{weather.rainfallMm} mm</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-warning" />
            <div>
              <div className="text-xs text-text-secondary">Pressure</div>
              <div className="text-sm font-medium">{weather.pressureHpa} hPa</div>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${weather.isAlert ? 'bg-error/10 border-error/20 text-error' : 'bg-surface/50 border-border text-text-secondary'}`}>
          <div className="flex items-start gap-2">
            {weather.isAlert && <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />}
            <p className="text-sm leading-tight">{weather.impactSummary}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
