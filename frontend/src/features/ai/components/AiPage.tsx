import { PageHeader } from '@/components/common/PageHeader';
import { useDecisionIntelligence } from '../hooks/useDecisionIntelligence';
import { AiRecommendationHero } from './AiRecommendationHero';
import { PipelineViewer } from './PipelineViewer';
import { ScenarioSimulator } from './ScenarioSimulator';
import { RecommendationTimeline } from './RecommendationTimeline';
import { ExecutionTimelineCard } from './ExecutionTimelineCard';
import { QuickActions } from './QuickActions';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function AiPage() {
  const { data, isLoading, error } = useDecisionIntelligence('1');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 text-ai animate-spin" />
        <div className="text-text-secondary animate-pulse">Running Intelligence Pipeline...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-error">
        Failed to load decision intelligence pipeline. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 overflow-hidden">
      <PageHeader 
        title="AI Decision Center" 
        description="Explainable Intelligence Pipeline aggregating rule-based engines and ML models." 
      />
      
      {/* SECTION 12: Quick Actions */}
      <QuickActions />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* SECTION 1 & 8: Hero & Explainable AI */}
        <AiRecommendationHero recommendation={data.recommendation} />
      </motion.div>

      {/* SECTION 2: Explainable Pipeline Viewer */}
      <div className="bg-surface/30 border border-border/50 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ai/20 via-primary/20 to-secondary/20" />
        <div className="p-4 border-b border-border/50 bg-surface/50">
          <h3 className="text-sm font-heading font-semibold text-text-primary uppercase tracking-wider">Explainable Pipeline</h3>
          <p className="text-xs text-text-secondary mt-1">Click any node to view execution details, rules, and AI feature importance.</p>
        </div>
        <PipelineViewer pipeline={data.pipeline} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* SECTION 9: Scenario Simulator */}
        <div className="lg:col-span-2">
          <ScenarioSimulator scenarios={data.scenarios} />
        </div>
        
        {/* Execution Timeline */}
        <div className="lg:col-span-1">
          <ExecutionTimelineCard pipeline={data.pipeline} />
        </div>
      </div>

      {/* Decision History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RecommendationTimeline timeline={data.timeline} />
        </div>
      </div>

    </div>
  );
}
