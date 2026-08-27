import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PipelineNodeData } from '../types';
import { Clock, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExecutionTimelineCardProps {
  pipeline: PipelineNodeData[];
}

export function ExecutionTimelineCard({ pipeline }: ExecutionTimelineCardProps) {
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-primary" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'running': return <Loader2 className="w-4 h-4 text-ai animate-spin" />;
      default: return <Clock className="w-4 h-4 text-text-secondary" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-primary/10 border-primary/30';
      case 'warning': return 'bg-warning/10 border-warning/30';
      case 'running': return 'bg-ai/10 border-ai/30';
      default: return 'bg-surface border-border';
    }
  };

  const totalExecutionTime = pipeline.reduce((sum, node) => sum + node.executionTimeMs, 0);

  return (
    <Card className="glass h-full">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" /> Execution Timeline
          </CardTitle>
          <Badge variant="outline" className="bg-surface text-text-secondary">
            Total: {(totalExecutionTime / 1000).toFixed(2)}s
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="relative pl-3 border-l border-border space-y-6">
          {pipeline.map((node) => {
            return (
              <div key={node.id} className="relative pl-6">
                <div className={`absolute -left-[20px] top-1 w-8 h-8 rounded-full border flex items-center justify-center bg-background ${getStatusBg(node.status)}`}>
                  {getStatusIcon(node.status)}
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">{node.label}</span>
                    <span className="text-xs text-text-secondary">
                      {node.executionTimeMs}ms
                    </span>
                  </div>
                  
                  <div className="mt-1">
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${
                      node.status === 'completed' ? 'text-primary' : 
                      node.status === 'warning' ? 'text-warning' : 
                      node.status === 'running' ? 'text-ai' : 'text-text-secondary'
                    }`}>
                      {node.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
