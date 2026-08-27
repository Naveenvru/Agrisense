import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AiRecommendation } from '../types';
import { Sparkles, BrainCircuit, ShieldAlert, TrendingUp, ChevronRight, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface AiRecommendationHeroProps {
  recommendation: AiRecommendation;
}

export function AiRecommendationHero({ recommendation }: AiRecommendationHeroProps) {
  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle2 className="w-4 h-4 text-primary" />;
      case 'medium': return <Info className="w-4 h-4 text-warning" />;
      case 'high': case 'critical': return <AlertTriangle className="w-4 h-4 text-error" />;
      default: return <Info className="w-4 h-4 text-text-secondary" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-primary border-primary/20 bg-primary/10';
      case 'medium': return 'text-warning border-warning/20 bg-warning/10';
      case 'high': case 'critical': return 'text-error border-error/20 bg-error/10';
      default: return 'text-text-secondary border-border bg-surface';
    }
  };

  return (
    <Card className="glass overflow-hidden relative w-full border-ai/30 shadow-2xl shadow-ai/10">
      {/* Decorative background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-ai/10 via-surface to-background z-0" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-ai/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      
      <CardContent className="p-8 relative z-10 flex flex-col lg:flex-row items-start justify-between gap-10">
        <div className="space-y-6 flex-1 w-full">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-ai/10 text-ai border-ai/30 gap-1.5 py-1 px-3">
              <BrainCircuit className="w-4 h-4" />
              Intelligence Hub
            </Badge>
            <Badge variant="outline" className={`${getRiskColor(recommendation.riskLevel)} gap-1.5 py-1 px-3`}>
              {getRiskIcon(recommendation.riskLevel)}
              {recommendation.riskLevel.charAt(0).toUpperCase() + recommendation.riskLevel.slice(1)} Risk
            </Badge>
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-3 leading-tight">
              {recommendation.title}
            </h1>
            <p className="text-lg text-text-secondary max-w-3xl leading-relaxed">
              {recommendation.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="bg-surface/50 border border-border rounded-xl p-4 backdrop-blur-sm hover:border-ai/30 transition-colors">
              <div className="text-sm text-text-secondary mb-1 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Expected Profit Increase
              </div>
              <div className="text-2xl font-heading font-bold text-primary">{recommendation.expectedProfitIncrease}</div>
            </div>
            <div className="bg-surface/50 border border-border rounded-xl p-4 backdrop-blur-sm hover:border-ai/30 transition-colors">
              <div className="text-sm text-text-secondary mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-ai" /> AI Confidence
              </div>
              <div className="text-2xl font-heading font-bold text-ai">{recommendation.confidence}%</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {recommendation.actions.map(action => (
              <Button 
                key={action.id}
                variant={action.variant === 'primary' ? 'default' : action.variant} 
                className={action.variant === 'primary' ? "gap-2 bg-ai hover:bg-ai/90 text-white" : "gap-2"}
              >
                {action.variant === 'primary' && <Sparkles className="w-4 h-4" />}
                {action.label}
                {action.variant !== 'primary' && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            ))}
          </div>
        </div>

        {/* Explainable AI Section */}
        <div className="w-full lg:w-[400px] shrink-0 bg-surface/60 border border-border rounded-2xl p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-6">
            <ShieldAlert className="w-5 h-5 text-secondary" />
            <h3 className="font-heading font-semibold text-lg text-text-primary">Why this recommendation?</h3>
          </div>
          
          <div className="space-y-4">
            {recommendation.explanations.map((exp, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className={`mt-1 rounded-full p-1 border ${
                  exp.impact === 'positive' ? 'bg-primary/10 border-primary/30 text-primary' : 
                  exp.impact === 'negative' ? 'bg-error/10 border-error/30 text-error' : 
                  'bg-warning/10 border-warning/30 text-warning'
                }`}>
                  {exp.impact === 'positive' ? <TrendingUp className="w-3 h-3" /> : 
                   exp.impact === 'negative' ? <TrendingUp className="w-3 h-3 rotate-180" /> : 
                   <div className="w-3 h-3 rounded-full bg-warning" />}
                </div>
                <div>
                  <div className="text-sm font-medium text-text-primary">{exp.factor}</div>
                  <div className="text-xs text-text-secondary leading-relaxed">{exp.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
