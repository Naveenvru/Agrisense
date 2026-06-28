import { PricePredictionData } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceChartProps {
  data: PricePredictionData[];
}

export function PriceChart({ data }: PriceChartProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-bold text-text-primary">Market Price Trajectory</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded text-xs font-bold bg-primary text-primary-foreground">7 Days</button>
          <button className="px-3 py-1 rounded text-xs font-bold bg-background/50 text-text-secondary border border-border hover:text-primary transition-colors">30 Days</button>
        </div>
      </div>
      
      <Card className="glass">
        <CardContent className="p-6">
          
          <div className="mb-6 flex flex-wrap gap-4 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-text-secondary" /> Historical Price (₹/qtl)
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary" /> AI Predicted Price
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-info opacity-40" /> Confidence Band
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--info))" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(var(--info))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="date" stroke="hsl(var(--text-secondary))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={['dataMin - 100', 'dataMax + 200']} stroke="hsl(var(--text-secondary))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--text-primary))' }}
                  itemStyle={{ color: 'hsl(var(--text-primary))' }}
                  labelStyle={{ fontWeight: 'bold', color: 'hsl(var(--text-secondary))', marginBottom: '8px' }}
                />
                
                {/* Confidence Range */}
                <Area type="monotone" dataKey="confidenceHigh" stroke="none" fill="url(#colorConfidence)" />
                <Area type="monotone" dataKey="confidenceLow" stroke="none" fill="hsl(var(--background))" />
                
                {/* Historical */}
                <Area type="monotone" dataKey="price" stroke="hsl(var(--text-secondary))" fill="none" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--background))", stroke: "hsl(var(--text-secondary))" }} activeDot={{ r: 6 }} />
                
                {/* Predicted */}
                <Area type="monotone" dataKey="predictedPrice" stroke="hsl(var(--primary))" fill="url(#colorPredicted)" strokeWidth={3} strokeDasharray="5 5" activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
        </CardContent>
      </Card>
    </section>
  );
}
