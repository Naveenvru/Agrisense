import { RegionalProfit } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Truck, IndianRupee, Map as MapIcon, Clock } from 'lucide-react';

interface RegionalProfitComparisonProps {
  markets: RegionalProfit[];
}

export function RegionalProfitComparison({ markets }: RegionalProfitComparisonProps) {
  if (!markets || markets.length === 0) return null;

  // Sort by highest net profit
  const sortedMarkets = [...markets].sort((a, b) => b.netProfit - a.netProfit);

  return (
    <section>
      <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Regional Profit Analysis</h2>
      
      <div className="space-y-4">
        {sortedMarkets.map((market, idx) => {
          const isBest = idx === 0;
          
          return (
            <Card key={idx} className={`glass overflow-hidden ${isBest ? 'border-primary shadow-sm' : ''}`}>
              <CardContent className="p-0">
                <div className={`p-4 flex flex-col gap-4 transition-colors hover:bg-background/50 ${isBest ? 'bg-primary/5' : ''}`}>
                  
                  {/* Top Row: Market Info & Net Profit */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl shrink-0 ${isBest ? 'bg-primary/20 text-primary' : 'bg-background/80 text-text-secondary border border-border/50'}`}>
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="font-bold text-text-primary leading-tight">{market.marketName}</div>
                          {isBest && <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Most Profitable</span>}
                        </div>
                        <div className="text-xs font-medium text-text-secondary flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1"><MapIcon className="w-3 h-3" /> {market.distance} km</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {market.travelTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider mb-0.5">Net Profit</span>
                      <span className={`text-lg font-bold flex items-center gap-0.5 ${isBest ? 'text-success' : 'text-text-primary'}`}>
                        <IndianRupee className="w-4 h-4" />
                        {market.netProfit.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row: Calculations */}
                  <div className="flex items-center justify-between gap-2 bg-background/50 px-3 py-2 rounded-lg border border-border/30">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider mb-0.5">Selling Price</span>
                      <span className="font-semibold text-text-primary text-sm">₹{market.sellingPrice}</span>
                    </div>
                    <div className="text-border text-lg font-light">-</div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider mb-0.5 flex items-center gap-1"><Truck className="w-3 h-3"/> Transport</span>
                      <span className="font-semibold text-error text-sm">₹{market.transportCost}</span>
                    </div>
                  </div>
                  
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
