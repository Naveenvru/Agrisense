import { useAuth } from '@/context/AuthContext';
import { MarketOpportunity } from '../types';
import { TrendingUp, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MarketHeroProps {
  opportunity: MarketOpportunity;
}

export function MarketHero({ opportunity }: MarketHeroProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  return (
    <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6 md:p-8 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-success/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary">
              {t('Good Morning, {{name}}', { name: user?.name || 'Farmer' })}
            </h1>
            <p className="text-text-secondary text-base md:text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {t('Market Intelligence')}
            </p>
            <p className="text-sm text-text-secondary opacity-80 pt-1 italic">
              {t('Sell smarter with AI-powered market insights.')}
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-background/80 backdrop-blur px-3 py-1.5 rounded-lg border border-border/50 text-sm font-medium text-text-secondary h-fit">
            <Clock className="w-4 h-4 text-primary" />
            Last Updated
            <span className="text-xs opacity-60 ml-2">Just now</span>
          </div>
        </div>

        {/* Opportunity Score */}
        <div className="bg-background/80 backdrop-blur border border-border/50 rounded-xl p-5 md:w-1/3 border-l-4 border-l-success">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-text-secondary">Market Opportunity</span>
            <span className="text-xl font-bold text-success">{opportunity.score} / 100</span>
          </div>
          <div className="text-lg font-bold text-text-primary">{opportunity.label}</div>
        </div>
      </div>
    </div>
  );
}
