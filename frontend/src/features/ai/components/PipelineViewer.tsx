import { useState } from 'react';
import { PipelineNodeData } from '../types';
import { PipelineNode } from './PipelineNode';
import { PipelineConnector } from './PipelineConnector';
import { PipelineDrawer } from './PipelineDrawer';


interface PipelineViewerProps {
  pipeline: PipelineNodeData[];
}

export function PipelineViewer({ pipeline }: PipelineViewerProps) {
  const [activeNode, setActiveNode] = useState<PipelineNodeData | null>(null);

  if (!pipeline || pipeline.length === 0) return null;

  return (
    <>
      <div className="w-full py-8 overflow-x-auto custom-scrollbar relative">
        <div className="min-w-max flex items-center px-8 relative">
          
          {pipeline.map((node, index) => {
            const isLast = index === pipeline.length - 1;
            
            return (
              <div key={node.id} className="flex items-center">
                <PipelineNode 
                  node={node} 
                  index={index} 
                  isActive={activeNode?.id === node.id}
                  onClick={(n) => setActiveNode(n)}
                />
                
                {!isLast && (
                  <PipelineConnector 
                    status={node.status} 
                    index={index} 
                  />
                )}
              </div>
            );
          })}

        </div>
      </div>

      {activeNode && (
        <PipelineDrawer 
          node={activeNode} 
          onClose={() => setActiveNode(null)} 
        />
      )}
    </>
  );
}
