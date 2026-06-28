import { useEffect } from 'react';
import { CommodityDetail } from '../types';
import { Button } from '@/components/ui/button';
import { X, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { AccordionSection } from '../../farm/components/ui/AccordionSection';

interface MarketDrawerProps {
  commodity: CommodityDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MarketDrawer({ commodity, isOpen, onClose }: MarketDrawerProps) {
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

  if (!isOpen || !commodity) return null;

  const getTrendIcon = () => {
    switch(commodity.trend) {
      case 'Bullish': return <TrendingUp className="w-5 h-5 text-success" />;
      case 'Bearish': return <TrendingDown className="w-5 h-5 text-error" />;
      default: return <Minus className="w-5 h-5 text-info" />;
    }
  };

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
              <TrendingUp className="w-4 h-4" />
              Commodity Intelligence
            </div>
            <h2 className="text-xl md:text-2xl font-heading font-semibold text-text-primary tracking-tight">
              {commodity.name}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-full hover:bg-hover">
            <X className="w-5 h-5 text-text-secondary hover:text-text-primary" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-surface/30">
          
          <div className="bg-background border border-border/50 rounded-xl p-4 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">Current Price</p>
              <p className="text-2xl font-bold text-text-primary">₹{commodity.currentPrice}</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">Market Trend</p>
              <div className="flex items-center gap-1.5 font-bold">
                {getTrendIcon()}
                {commodity.trend}
              </div>
            </div>
          </div>

          <AccordionSection title="AI Recommendation" defaultOpen>
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
              <div className="flex items-center gap-2 text-primary font-bold mb-2">
                <Info className="w-5 h-5" />
                Action: {commodity.status}
              </div>
              <p className="text-text-primary font-medium text-sm">
                Based on current market conditions and expected supply, we recommend {commodity.status.toLowerCase()} to maximize profit.
              </p>
            </div>
          </AccordionSection>

          <AccordionSection title="Historical Trend (Placeholder)" defaultOpen>
            <div className="bg-muted rounded-xl h-48 w-full animate-pulse border border-border/50 flex items-center justify-center text-text-secondary text-sm font-medium">
              Chart Placeholder
            </div>
          </AccordionSection>

          <AccordionSection title="Regional Comparison">
            <p className="text-sm text-text-secondary italic mb-3">Compare prices across nearby APMCs.</p>
            <div className="space-y-2">
              <div className="bg-background border border-border p-3 rounded-lg text-sm flex justify-between items-center">
                <span className="font-medium text-text-primary">Bengaluru APMC</span>
                <span className="font-bold text-success">₹2,850</span>
              </div>
              <div className="bg-background border border-border p-3 rounded-lg text-sm flex justify-between items-center">
                <span className="font-medium text-text-primary">Mysuru APMC</span>
                <span className="font-bold text-text-primary">₹2,790</span>
              </div>
            </div>
          </AccordionSection>
          
          <AccordionSection title="Demand & Supply Analysis">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-secondary font-medium">Current Demand</span>
                  <span className="font-bold text-success">High</span>
                </div>
                <div className="w-full bg-border/50 rounded-full h-1.5">
                  <div className="bg-success h-1.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-secondary font-medium">Regional Supply</span>
                  <span className="font-bold text-warning">Low</span>
                </div>
                <div className="w-full bg-border/50 rounded-full h-1.5">
                  <div className="bg-warning h-1.5 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </AccordionSection>

          <AccordionSection title="Execution History">
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-3 opacity-60">
              <Info className="w-6 h-6 text-text-secondary" />
              <div>
                <p className="font-medium text-text-primary text-sm">No History Available</p>
                <p className="text-xs text-text-secondary mt-1">Previous actions for this commodity will be logged here.</p>
              </div>
            </div>
          </AccordionSection>

        </div>
      </div>
    </div>
  );
}
