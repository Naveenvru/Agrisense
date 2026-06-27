import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { MOCK_WEATHER_DATA } from '../mocks/weather.mock';
import { CloudRain, Wind, Droplets, Sun, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WeatherPage() {
  const { current, forecast, weekly } = MOCK_WEATHER_DATA;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Weather Intelligence" 
        description="Detailed hyper-local weather forecasts for your farm." 
        action={
          <Button variant="outline" className="gap-2">
            <MapPin className="w-4 h-4" />
            Field A Station
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Weather Hero */}
        <Card className="glass lg:col-span-2 bg-gradient-to-br from-surface to-primary/5">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl font-heading font-medium text-text-secondary mb-2">Today</h2>
              <div className="flex items-center gap-4">
                <span className="text-7xl font-heading font-bold text-text-primary">{current.temp}°</span>
                <div className="flex flex-col">
                  <span className="text-xl font-medium text-text-primary">{current.condition}</span>
                  <span className="text-text-secondary">Feels like {current.temp + 1}°</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5 text-secondary" />
                <div>
                  <div className="text-sm text-text-secondary">Humidity</div>
                  <div className="font-medium">{current.humidity}%</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wind className="w-5 h-5 text-text-secondary" />
                <div>
                  <div className="text-sm text-text-secondary">Wind</div>
                  <div className="font-medium">{current.wind} km/h</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-warning" />
                <div>
                  <div className="text-sm text-text-secondary">UV Index</div>
                  <div className="font-medium">{current.uvIndex}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CloudRain className="w-5 h-5 text-secondary" />
                <div>
                  <div className="text-sm text-text-secondary">Rain</div>
                  <div className="font-medium">{current.precipitation} mm</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hourly Forecast */}
        <Card className="glass lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Hourly Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center h-full pt-4 pb-2">
              {forecast.map((f, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <span className="text-xs text-text-secondary">{f.time}</span>
                  {f.condition.includes('Rain') ? (
                    <CloudRain className="w-6 h-6 text-secondary" />
                  ) : (
                    <Sun className="w-6 h-6 text-warning" />
                  )}
                  <span className="font-medium">{f.temp}°</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5-Day Forecast */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-heading">5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {weekly.map((day, i) => (
              <div key={i} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                <span className="w-16 font-medium">{day.day}</span>
                <div className="flex items-center gap-2 w-32">
                  {day.condition.includes('Rain') ? (
                    <CloudRain className="w-5 h-5 text-secondary" />
                  ) : (
                    <Sun className="w-5 h-5 text-warning" />
                  )}
                  <span className="text-sm">{day.condition}</span>
                </div>
                <div className="flex items-center gap-4 text-sm w-32">
                  <span className="text-secondary flex items-center gap-1">
                    <Droplets className="w-3 h-3" />
                    {day.rainChance}%
                  </span>
                </div>
                <div className="flex items-center gap-3 w-24 justify-end">
                  <span className="text-text-secondary">{day.min}°</span>
                  <div className="w-12 h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-secondary to-warning" style={{ width: '60%', marginLeft: '20%' }}></div>
                  </div>
                  <span className="font-medium">{day.max}°</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
