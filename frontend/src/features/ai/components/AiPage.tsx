import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { BrainCircuit, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AiPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="AI Decision Center" 
        description="Actionable intelligence powered by advanced machine learning." 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass border-ai/30 bg-gradient-to-br from-surface to-ai/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-ai/20 rounded-lg">
                <Zap className="w-5 h-5 text-ai" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-text-primary">Yield Optimization</h3>
            </div>
            <p className="text-sm text-text-secondary mb-6">
              Based on recent soil data and upcoming weather patterns, adjusting nitrogen application in Field A could increase yield by 8-12%.
            </p>
            <Button className="w-full bg-ai hover:bg-ai/90 text-white">Apply Recommendation</Button>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-secondary/20 rounded-lg">
                <BrainCircuit className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-text-primary">Irrigation Strategy</h3>
            </div>
            <p className="text-sm text-text-secondary mb-6">
              Hold irrigation for Field B. Rain is highly probable in 48 hours, saving approximately 15,000L of water.
            </p>
            <Button variant="outline" className="w-full">View Analysis</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
