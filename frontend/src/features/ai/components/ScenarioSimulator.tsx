import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScenarioSimulation } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, Wheat, TrendingUp, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ScenarioSimulatorProps {
  scenarios: ScenarioSimulation[];
}

export function ScenarioSimulator({ scenarios }: ScenarioSimulatorProps) {
  const [activeTab, setActiveTab] = useState<string>(scenarios[0]?.id);

  const activeScenario = scenarios.find(s => s.id === activeTab) || scenarios[0];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-primary border-primary/20 bg-primary/10';
      case 'medium': return 'text-warning border-warning/20 bg-warning/10';
      case 'high': case 'critical': return 'text-error border-error/20 bg-error/10';
      default: return 'text-text-secondary border-border bg-surface';
    }
  };

  if (!scenarios.length) return null;

  return (
    <Card className="glass h-full">
      <CardHeader className="pb-4 border-b border-border/50">
        <CardTitle className="text-lg font-heading">Scenario Simulator</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setActiveTab(scenario.id)}
              className={`px-4 py-2 text-sm rounded-full transition-colors relative ${
                activeTab === scenario.id 
                  ? 'text-primary font-medium' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
              }`}
            >
              {activeTab === scenario.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-full z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{scenario.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScenario.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface/40 p-4 rounded-xl border border-border">
                <div className="text-xs text-text-secondary mb-2 flex items-center gap-1">
                  <IndianRupee className="w-3 h-3 text-secondary" /> Expected Profit
                </div>
                <div className="text-xl font-heading font-bold text-secondary">
                  ₹{activeScenario.expectedProfit.toLocaleString()}
                </div>
              </div>
              
              <div className="bg-surface/40 p-4 rounded-xl border border-border">
                <div className="text-xs text-text-secondary mb-2 flex items-center gap-1">
                  <Wheat className="w-3 h-3 text-primary" /> Expected Yield
                </div>
                <div className="text-xl font-heading font-bold text-primary">
                  {activeScenario.expectedYieldKg.toLocaleString()} kg
                </div>
              </div>

              <div className="bg-surface/40 p-4 rounded-xl border border-border">
                <div className="text-xs text-text-secondary mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-blue-400" /> Market Price
                </div>
                <div className="text-xl font-heading font-bold text-text-primary">
                  ₹{activeScenario.marketPrice.toFixed(2)} / kg
                </div>
              </div>

              <div className="bg-surface/40 p-4 rounded-xl border border-border flex flex-col justify-center">
                <div className="text-xs text-text-secondary mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Risk Level
                </div>
                <div>
                  <Badge variant="outline" className={`capitalize ${getRiskColor(activeScenario.riskLevel)}`}>
                    {activeScenario.riskLevel}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-ai/5 border border-ai/20 rounded-xl p-4 flex items-start gap-3">
              <div className="mt-0.5"><AlertTriangle className="w-4 h-4 text-ai" /></div>
              <div>
                <div className="text-sm font-medium text-ai mb-1">AI Analysis</div>
                <div className="text-sm text-text-secondary">{activeScenario.recommendation}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
