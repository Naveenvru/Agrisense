import { motion, AnimatePresence } from 'framer-motion';
import { PipelineNodeData } from '../types';
import { X, Database, Settings2, FileOutput, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { DrawerSection } from './DrawerSection';
import { Badge } from '@/components/ui/badge';

interface PipelineDrawerProps {
  node: PipelineNodeData | null;
  onClose: () => void;
}

export function PipelineDrawer({ node, onClose }: PipelineDrawerProps) {
  
  if (!node) return null;

  const renderShapOrRules = () => {
    // If SHAP values exist (future ML integration), render them
    if (node.shapValues && node.shapValues.length > 0) {
      return (
        <DrawerSection title="SHAP Explainer (AI Model)" icon={Sparkles} iconColor="text-ai">
          <div className="space-y-4">
            {node.shapValues.map((shap, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span className="text-text-primary font-medium">{shap.feature}</span>
                  <span className={shap.impact === 'positive' ? 'text-primary' : 'text-error'}>
                    {shap.impact === 'positive' ? '+' : '-'}{shap.value.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-background rounded-full h-1.5 overflow-hidden flex">
                  {shap.impact === 'positive' ? (
                    <>
                      <div className="flex-1 bg-transparent" />
                      <div className="flex-1 bg-primary origin-left" style={{ transform: `scaleX(${Math.min(shap.value * 2, 1)})` }} />
                    </>
                  ) : (
                    <>
                      <div className="flex-1 bg-error origin-right flex justify-end" style={{ transform: `scaleX(${Math.min(shap.value * 2, 1)})` }} />
                      <div className="flex-1 bg-transparent" />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DrawerSection>
      );
    }
    
    // Otherwise render current Rule-Based Business Rules
    if (node.businessRules && node.businessRules.length > 0) {
      return (
        <DrawerSection title="Business Rules Engine" icon={Settings2} iconColor="text-secondary">
          <ul className="space-y-2 text-sm text-text-secondary list-disc pl-4 marker:text-border">
            {node.businessRules.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ul>
        </DrawerSection>
      );
    }
    
    return null;
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <motion.div 
        initial={{ x: '100%', boxShadow: '-20px 0 50px rgba(0,0,0,0)' }}
        animate={{ x: 0, boxShadow: '-20px 0 50px rgba(0,0,0,0.5)' }}
        exit={{ x: '100%', boxShadow: '-20px 0 50px rgba(0,0,0,0)' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-background border-l border-border z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-surface/50">
          <div>
            <div className="text-xs text-ai font-bold uppercase tracking-wider mb-1">{node.engine}</div>
            <h2 className="text-xl font-heading font-bold text-text-primary">{node.label}</h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="bg-surface text-text-secondary border-border">{node.executionTimeMs}ms</Badge>
              <Badge variant="outline" className={node.status === 'completed' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-warning/10 text-warning border-warning/20'}>
                {node.status}
              </Badge>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface text-text-secondary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          
          {node.recommendation && (
            <div className="mb-6 bg-ai/10 border border-ai/20 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-ai shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-ai mb-1">Engine Recommendation</h4>
                <p className="text-sm text-text-secondary">{node.recommendation}</p>
              </div>
            </div>
          )}

          {node.inputs && Object.keys(node.inputs).length > 0 && (
            <DrawerSection title="Data Inputs" icon={Database} iconColor="text-blue-400">
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                {Object.entries(node.inputs).map(([key, val]) => (
                  <div key={key}>
                    <div className="text-[10px] uppercase text-text-secondary mb-0.5">{key}</div>
                    <div className="text-sm font-medium text-text-primary">{String(val)}</div>
                  </div>
                ))}
              </div>
            </DrawerSection>
          )}

          {renderShapOrRules()}

          {node.featureImportance && node.featureImportance.length > 0 && (
            <DrawerSection title="Feature Importance" icon={TrendingUp} iconColor="text-orange-400">
               <div className="space-y-3">
                {node.featureImportance.map((fi, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary">{fi.feature}</span>
                      <span className="text-text-primary font-medium">{fi.weight}%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-1.5 overflow-hidden">
                      <div className="bg-orange-400 h-full rounded-full" style={{ width: `${fi.weight}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </DrawerSection>
          )}

          {node.outputs && Object.keys(node.outputs).length > 0 && (
            <DrawerSection title="Outputs / Results" icon={FileOutput} iconColor="text-primary">
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                {Object.entries(node.outputs).map(([key, val]) => (
                  <div key={key}>
                    <div className="text-[10px] uppercase text-text-secondary mb-0.5">{key}</div>
                    <div className="text-lg font-heading font-bold text-text-primary">{String(val)}</div>
                  </div>
                ))}
              </div>
            </DrawerSection>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
