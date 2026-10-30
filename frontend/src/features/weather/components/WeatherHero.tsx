import { useAuth } from '@/context/AuthContext';
import { WeatherData, RiskLevel } from '../types';
import { MapPin, Droplets, Thermometer, BrainCircuit, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WeatherHeroProps {
  weather: WeatherData;
  aiConfidence: number;
  overallRisk: RiskLevel;
}

export function WeatherHero({ weather, aiConfidence, overallRisk }: WeatherHeroProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const riskColor = {
    'Safe': 'text-success bg-success/10 border-success/30',
    'Caution': 'text-warning bg-warning/10 border-warning/30',
    'High Risk': 'text-orange-500 bg-orange-500/10 border-orange-500/30',
    'Critical': 'text-error bg-error/10 border-error/30',
  }[overallRisk];

  return (
    <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6 md:p-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary">
              {t('Good Morning, {{name}}', { name: user?.name || 'Farmer' })}
            </h1>
            <p className="text-text-secondary text-base md:text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              {t('Weather Intelligence Center')}
            </p>
            <p className="text-sm text-text-secondary opacity-80 pt-1 italic">
              {t('Know the weather before your crops do.')}
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-background/80 backdrop-blur px-3 py-1.5 rounded-lg border border-border/50 text-sm font-medium text-text-secondary h-fit">
            <MapPin className="w-4 h-4 text-primary" />
            Sunny Valley Region
            <span className="text-xs opacity-60 ml-2">Updated 5m ago</span>
          </div>
        </div>

        {/* Quick Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          
          <div className="bg-background/80 backdrop-blur border border-border/50 rounded-xl p-4 flex flex-col justify-between group hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2 text-text-secondary mb-3">
              <Thermometer className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium uppercase tracking-wider">Current Temp</span>
            </div>
            <div className="text-2xl font-bold text-text-primary">{weather.temperature}°C</div>
            <div className="text-xs text-text-secondary mt-1">Feels like {weather.feelsLike}°C</div>
          </div>

          <div className="bg-background/80 backdrop-blur border border-border/50 rounded-xl p-4 flex flex-col justify-between group hover:border-info/30 transition-colors">
            <div className="flex items-center gap-2 text-text-secondary mb-3">
              <Droplets className="w-4 h-4 text-info group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium uppercase tracking-wider">Rain Prob.</span>
            </div>
            <div className="text-2xl font-bold text-info">85%</div>
            <div className="text-xs text-text-secondary mt-1">{weather.rainfall}mm Expected</div>
          </div>

          <div className="bg-background/80 backdrop-blur border border-border/50 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-text-secondary mb-3">
              <Activity className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Overall Risk</span>
            </div>
            <div className={`text-sm font-bold px-3 py-1.5 rounded border w-fit ${riskColor}`}>
              {overallRisk}
            </div>
          </div>

          <div className="bg-background/80 backdrop-blur border border-border/50 rounded-xl p-4 flex flex-col justify-between group hover:border-success/30 transition-colors">
            <div className="flex items-center gap-2 text-text-secondary mb-3">
              <BrainCircuit className="w-4 h-4 text-success group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium uppercase tracking-wider">AI Confidence</span>
            </div>
            <div className="text-2xl font-bold text-success">{aiConfidence}%</div>
            <div className="text-xs text-text-secondary mt-1">Based on 14 data points</div>
          </div>

        </div>
      </div>
    </div>
  );
}
