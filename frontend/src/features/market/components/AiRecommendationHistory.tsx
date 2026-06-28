import { RecommendationHistoryItem } from '../types';
import { Card, CardContent } from '@/components/ui/card';


interface AiRecommendationHistoryProps {
  history: RecommendationHistoryItem[];
}

export function AiRecommendationHistory({ history }: AiRecommendationHistoryProps) {
  
  const getActionColor = (action: string) => {
    switch(action) {
      case 'Sell Today': return 'text-success bg-success/10 border-success/30';
      case 'Wait': return 'text-warning bg-warning/10 border-warning/30';
      case 'Store': return 'text-info bg-info/10 border-info/30';
      case 'Transport': return 'text-primary bg-primary/10 border-primary/30';
      default: return 'text-secondary bg-secondary/10 border-secondary/30';
    }
  };

  return (
    <section>
      <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Recommendation History</h2>
      <Card className="glass relative overflow-hidden">
        
        {/* Timeline line */}
        <div className="absolute top-8 bottom-8 left-6 md:left-8 w-px bg-border/50 hidden sm:block" />
        
        <CardContent className="p-4 md:p-6 space-y-6">
          {history.map((item, idx) => {
            const colorClass = getActionColor(item.action);
            
            return (
              <div key={idx} className="relative flex flex-col sm:flex-row sm:items-start gap-4 z-10">
                
                {/* Node */}
                <div className="flex sm:flex-col sm:items-center gap-3 sm:gap-2 sm:w-24 shrink-0">
                  <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-background z-10 mt-1 sm:mt-0" />
                  <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">{item.date}</span>
                </div>
                
                {/* Content */}
                <div className="flex-1 bg-background/50 border border-border/50 p-4 rounded-xl hover:border-border transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-text-primary text-lg">{item.commodity}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border w-fit ${colorClass}`}>
                      {item.action}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary font-medium">{item.details}</p>
                </div>
                
              </div>
            );
          })}
        </CardContent>
      </Card>
    </section>
  );
}
