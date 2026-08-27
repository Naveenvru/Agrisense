import { motion } from 'framer-motion';
import { PipelineNodeData } from '../types';
import { CloudRain, Scissors, Wheat, Truck, ShoppingCart, BarChart3, Target, User, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const getIcon = (type: string) => {
  switch (type) {
    case 'cloud-rain': return CloudRain;
    case 'scissors': return Scissors;
    case 'wheat': return Wheat;
    case 'truck': return Truck;
    case 'shopping-cart': return ShoppingCart;
    case 'bar-chart': return BarChart3;
    case 'user': return User;
    case 'target': default: return Target;
  }
};

interface PipelineNodeProps {
  node: PipelineNodeData;
  index: number;
  isActive: boolean;
  onClick: (node: PipelineNodeData) => void;
}

export function PipelineNode({ node, index, isActive, onClick }: PipelineNodeProps) {
  const Icon = getIcon(node.iconType);
  const isFinal = node.engine === 'decision-engine';

  const getStatusColor = () => {
    switch (node.status) {
      case 'completed': return 'text-primary border-primary/50';
      case 'warning': return 'text-warning border-warning/50';
      case 'running': return 'text-ai border-ai/50';
      default: return 'text-text-secondary border-border';
    }
  };

  const getStatusIcon = () => {
    switch (node.status) {
      case 'completed': return <CheckCircle2 className="w-3 h-3 text-primary" />;
      case 'warning': return <AlertTriangle className="w-3 h-3 text-warning" />;
      case 'running': return <Loader2 className="w-3 h-3 text-ai animate-spin" />;
      default: return null;
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center gap-3 group shrink-0">
      <motion.button 
        onClick={() => onClick(node)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.1, type: "spring" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative w-16 h-16 rounded-2xl flex items-center justify-center border-2 bg-background shadow-lg transition-all
          ${isActive ? 'border-ai bg-ai/10 shadow-ai/20 ring-4 ring-ai/20' : getStatusColor()}`}
      >
        <div className="absolute -top-2 -right-2 bg-background rounded-full p-0.5 border border-border">
          {getStatusIcon()}
        </div>
        
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-surface/80 backdrop-blur-sm`}>
          <Icon className={`w-6 h-6 ${isFinal ? 'text-ai' : isActive ? 'text-text-primary' : 'text-text-secondary'}`} />
        </div>
      </motion.button>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 + 0.1 }}
        className="flex flex-col items-center"
      >
        <span className={`text-xs font-medium whitespace-nowrap mb-1 ${isActive || isFinal ? 'text-text-primary font-bold' : 'text-text-secondary group-hover:text-text-primary transition-colors'}`}>
          {node.label}
        </span>
        <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 bg-surface border-border text-text-secondary">
          {node.executionTimeMs}ms
        </Badge>
      </motion.div>
    </div>
  );
}
