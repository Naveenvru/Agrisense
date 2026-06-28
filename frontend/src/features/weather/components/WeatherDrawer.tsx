import { useEffect } from 'react';
import { DailyForecast } from '../types';
import { Button } from '@/components/ui/button';
import { X, Calendar, Droplets, Thermometer, Wind, CheckCircle2, History } from 'lucide-react';
import { AccordionSection } from '../../farm/components/ui/AccordionSection';

interface WeatherDrawerProps {
  day: DailyForecast | null;
  isOpen: boolean;
  onClose: () => void;
}

export function WeatherDrawer({ day, isOpen, onClose }: WeatherDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !day) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md md:max-w-xl h-full bg-background border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-card">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold mb-1 uppercase tracking-wider text-xs">
              <Calendar className="w-4 h-4" />
              Intelligence Details
            </div>
            <h2 className="text-xl md:text-2xl font-heading font-semibold text-text-primary tracking-tight">
              {day.date}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-full hover:bg-hover">
            <X className="w-5 h-5 text-text-secondary hover:text-text-primary" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-surface/30">
          
          <AccordionSection title="Expected Conditions" defaultOpen>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-text-secondary text-xs">Temperature</p>
                  <p className="font-medium text-text-primary">{day.maxTemp}°C / {day.minTemp}°C</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-info" />
                <div>
                  <p className="text-text-secondary text-xs">Rain Probability</p>
                  <p className="font-medium text-text-primary">{day.rainProbability}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-text-secondary text-xs">Humidity</p>
                  <p className="font-medium text-text-primary">{day.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-text-secondary" />
                <div>
                  <p className="text-text-secondary text-xs">Wind Speed</p>
                  <p className="font-medium text-text-primary">{day.windSpeed} km/h</p>
                </div>
              </div>
            </div>
          </AccordionSection>

          <AccordionSection title="Agricultural Impact" defaultOpen>
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
              <div className="flex items-center gap-2 text-primary font-bold mb-2">
                <CheckCircle2 className="w-5 h-5" />
                Primary Recommendation
              </div>
              <p className="text-text-primary font-medium">{day.agriculturalImpact}</p>
            </div>
          </AccordionSection>

          <AccordionSection title="Affected Farms">
            <p className="text-sm text-text-secondary italic mb-2">Impacted locations will appear here.</p>
            <div className="space-y-2">
              <div className="bg-background border border-border p-3 rounded-lg text-sm text-text-primary font-medium">Sunny Valley Farm</div>
              <div className="bg-background border border-border p-3 rounded-lg text-sm text-text-primary font-medium">Riverbed Acres</div>
            </div>
          </AccordionSection>
          
          <AccordionSection title="Related Calendar Tasks">
            <p className="text-sm text-text-secondary italic mb-2">Scheduled tasks sensitive to these conditions:</p>
            <div className="space-y-2 opacity-70">
              <div className="bg-background border border-border p-3 rounded-lg text-sm font-medium flex justify-between">
                <span>Morning Irrigation</span>
                <span className="text-xs bg-error/10 text-error px-2 py-0.5 rounded">High Risk</span>
              </div>
              <div className="bg-background border border-border p-3 rounded-lg text-sm font-medium flex justify-between">
                <span>Fertilizer Application</span>
                <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded">Caution</span>
              </div>
            </div>
          </AccordionSection>

          <AccordionSection title="Recommendation History">
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-3 opacity-60">
              <History className="w-6 h-6 text-text-secondary" />
              <div>
                <p className="font-medium text-text-primary text-sm">No History Available</p>
                <p className="text-xs text-text-secondary mt-1">Previous actions for similar conditions will be logged here.</p>
              </div>
            </div>
          </AccordionSection>

        </div>
      </div>
    </div>
  );
}
