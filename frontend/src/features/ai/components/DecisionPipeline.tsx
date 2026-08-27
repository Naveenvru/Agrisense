import { motion } from 'framer-motion';
import { CloudRain, Scissors, Wheat, Truck, ShoppingCart, BarChart3, Target } from 'lucide-react';


const PIPELINE_NODES = [
  { id: 'weather', label: 'Weather', icon: CloudRain, color: 'text-secondary' },
  { id: 'harvest', label: 'Harvest', icon: Scissors, color: 'text-warning' },
  { id: 'yield', label: 'Yield', icon: Wheat, color: 'text-primary' },
  { id: 'supply', label: 'Supply', icon: Truck, color: 'text-blue-400' },
  { id: 'demand', label: 'Demand', icon: ShoppingCart, color: 'text-pink-400' },
  { id: 'market', label: 'Market', icon: BarChart3, color: 'text-orange-400' },
  { id: 'decision', label: 'Decision', icon: Target, color: 'text-ai' }
];

export function DecisionPipeline() {
  return (
    <div className="w-full py-6 overflow-x-auto custom-scrollbar">
      <div className="min-w-[800px] flex items-center justify-between relative px-4">
        {/* Connecting Line */}
        <div className="absolute left-[40px] right-[40px] top-1/2 -translate-y-1/2 h-1 bg-border/50 z-0 rounded-full" />
        
        {/* Animated flow line */}
        <motion.div 
          className="absolute left-[40px] top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-secondary via-primary to-ai z-0 rounded-full origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{ width: 'calc(100% - 80px)' }}
        />

        {/* Nodes */}
        {PIPELINE_NODES.map((node, index) => {
          const Icon = node.icon;
          const isLast = index === PIPELINE_NODES.length - 1;
          
          return (
            <div key={node.id} className="relative z-10 flex flex-col items-center gap-3 group cursor-pointer">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2, type: "spring" }}
                whileHover={{ scale: 1.1 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-surface bg-background shadow-lg transition-colors
                  ${isLast ? 'shadow-ai/20 border-ai/30' : 'group-hover:border-primary/50'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-surface/80 backdrop-blur-sm`}>
                  <Icon className={`w-5 h-5 ${node.color}`} />
                </div>
              </motion.div>
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 + 0.1 }}
                className={`text-xs font-medium ${isLast ? 'text-ai font-bold' : 'text-text-secondary group-hover:text-text-primary transition-colors'}`}
              >
                {node.label}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
