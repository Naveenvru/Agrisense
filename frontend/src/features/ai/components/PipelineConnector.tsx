import { motion } from 'framer-motion';
import { PipelineStatus } from '../types';

interface PipelineConnectorProps {
  status: PipelineStatus;
  index: number;
}

export function PipelineConnector({ status, index }: PipelineConnectorProps) {
  
  const getGradient = () => {
    switch (status) {
      case 'completed': return 'from-primary/50 to-primary';
      case 'warning': return 'from-warning/50 to-warning';
      case 'running': return 'from-border to-ai';
      default: return 'from-border to-border';
    }
  };

  return (
    <div className="flex-1 h-1 min-w-[40px] max-w-[80px] bg-border/50 mx-2 rounded-full relative overflow-hidden shrink-0 mt-8">
      {status !== 'pending' && (
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-r ${getGradient()} rounded-full origin-left`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: index * 0.15, ease: "easeInOut" }}
        />
      )}
      {status === 'running' && (
        <motion.div
          className="absolute inset-0 w-1/2 bg-white/30 rounded-full blur-[2px]"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}
