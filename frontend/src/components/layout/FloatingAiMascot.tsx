import { useState, useEffect } from 'react';
import { AiChatDrawer } from './AiChatDrawer';
import { TreeMascot } from '@/components/ui/TreeMascot';

export function FloatingAiMascot() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsDrawerOpen(true);
    window.addEventListener('open-ai-chat', handleOpen);
    return () => window.removeEventListener('open-ai-chat', handleOpen);
  }, []);

  return (
    <>
      {/* Floating Mascot Launcher */}
      <button 
        onClick={() => setIsDrawerOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 group focus:outline-none focus:ring-4 focus:ring-primary/30 rounded-full"
        aria-label="Open Ask AgriSense AI"
        title="Ask AgriSense AI"
      >
        <div className="relative w-16 h-16 md:w-20 md:h-20 animate-float transition-transform duration-300 group-hover:scale-110">
          
          {/* Glowing Particles Background */}
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl"></div>
          
          <div className="absolute top-0 right-0 w-2 h-2 bg-success rounded-full animate-particle delay-75 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
          <div className="absolute bottom-2 left-0 w-2 h-2 bg-success rounded-full animate-particle shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
          
          {/* Animated Mascot Component */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <TreeMascot className="w-12 h-12 md:w-16 md:h-16" />
          </div>
        </div>
      </button>

      {/* Drawer */}
      <AiChatDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
