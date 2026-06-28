import { Card, CardContent } from '@/components/ui/card';
import { Map, Layers } from 'lucide-react';

export function WeatherMapCard() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-bold text-text-primary">Interactive Weather Radar</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded text-xs font-bold bg-primary text-primary-foreground flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Rainfall</button>
          <button className="px-3 py-1 rounded text-xs font-bold bg-background/50 text-text-secondary border border-border">Temperature</button>
        </div>
      </div>
      
      <Card className="glass overflow-hidden border-primary/20">
        <CardContent className="p-0">
          <div className="h-[400px] w-full bg-surface/50 relative flex flex-col items-center justify-center text-center p-8 group">
            
            {/* Mock Map Grid Background */}
            <div className="absolute inset-0 opacity-10" 
                 style={{ backgroundImage: 'radial-gradient(hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            <div className="p-4 rounded-full bg-primary/10 mb-4 z-10 group-hover:scale-110 transition-transform">
              <Map className="w-10 h-10 text-primary" />
            </div>
            
            <h3 className="text-lg font-bold text-text-primary z-10 mb-2">GIS Map Integration Pending</h3>
            <p className="text-sm text-text-secondary max-w-md z-10">
              This section is reserved for future Leaflet/OpenLayers integration. It will display live weather radar, rainfall layers, temperature gradients, and farm locations.
            </p>
            
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
