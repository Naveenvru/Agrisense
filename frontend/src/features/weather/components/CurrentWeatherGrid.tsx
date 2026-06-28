import { WeatherData } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Wind, Droplets, Gauge, Sun, Wind as WindIcon, Eye, Sunrise, Sunset, Cloud } from 'lucide-react';

interface CurrentWeatherGridProps {
  weather: WeatherData;
}

export function CurrentWeatherGrid({ weather }: CurrentWeatherGridProps) {
  
  const WeatherCard = ({ title, value, unit, icon: Icon, description }: any) => (
    <Card className="glass hover:bg-background/80 transition-colors group">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-text-secondary text-sm font-medium mb-1">
            <Icon className="w-4 h-4 group-hover:text-primary transition-colors" />
            {title}
          </div>
          <div className="text-xl font-bold text-text-primary">
            {value}<span className="text-sm text-text-secondary font-normal ml-0.5">{unit}</span>
          </div>
          <div className="text-xs text-text-secondary opacity-80 mt-0.5">{description}</div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section>
      <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Current Conditions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <WeatherCard 
          title="Humidity" 
          value={weather.humidity} 
          unit="%" 
          icon={Droplets} 
          description={weather.humidity > 70 ? "High - Monitor disease" : "Optimal range"} 
        />
        
        <WeatherCard 
          title="Wind Speed" 
          value={weather.windSpeed} 
          unit="km/h" 
          icon={Wind} 
          description={`${weather.windDirection} - Safe for spraying`} 
        />
        
        <WeatherCard 
          title="UV Index" 
          value={weather.uvIndex} 
          unit="" 
          icon={Sun} 
          description={weather.uvIndex > 5 ? "High - Protect workers" : "Moderate"} 
        />
        
        <WeatherCard 
          title="Air Quality" 
          value={weather.airQuality} 
          unit="AQI" 
          icon={WindIcon} 
          description={weather.airQuality < 50 ? "Good" : "Moderate"} 
        />
        
        <WeatherCard 
          title="Pressure" 
          value={weather.pressure} 
          unit="hPa" 
          icon={Gauge} 
          description="Stable" 
        />
        
        <WeatherCard 
          title="Visibility" 
          value={weather.visibility} 
          unit="km" 
          icon={Eye} 
          description="Clear" 
        />
        
        <WeatherCard 
          title="Cloud Cover" 
          value={weather.cloudCover} 
          unit="%" 
          icon={Cloud} 
          description="Partly Cloudy" 
        />
        
        <WeatherCard 
          title="Dew Point" 
          value={weather.dewPoint} 
          unit="°C" 
          icon={Droplets} 
          description="No frost risk" 
        />
        
        <WeatherCard 
          title="Sunrise" 
          value={weather.sunrise} 
          unit="" 
          icon={Sunrise} 
          description="Best work time" 
        />
        
        <WeatherCard 
          title="Sunset" 
          value={weather.sunset} 
          unit="" 
          icon={Sunset} 
          description="Finish spraying by 5PM" 
        />
        
      </div>
    </section>
  );
}
