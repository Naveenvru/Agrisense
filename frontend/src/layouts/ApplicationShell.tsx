import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { Footer } from '@/components/layout/Footer';
import { FloatingAiMascot } from '@/components/layout/FloatingAiMascot';
import { useAnalytics } from '@/hooks/useAnalytics';

export function ApplicationShell({ children }: { children: ReactNode }) {
  useAnalytics();

  return (
    <div className="flex h-screen bg-background bg-gradient-to-br from-background via-background to-surface text-text-primary overflow-hidden relative">
      
      {/* --- Universal Branded Background --- */}
      <div className="fixed inset-0 pointer-events-none z-[-50] agrisense-bg overflow-hidden">
        {/* Animated Particles and Glow */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-bg-pan"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-bg-pan" style={{ animationDelay: '-10s' }}></div>
        </div>
        
        {/* The 80% Logo Watermark */}
        <img 
          src="/logo.png" 
          alt="" 
          className="fixed top-[55%] left-[58%] -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[1400px] h-auto object-contain opacity-[0.025] blur-[10px] saturate-[0.8] mix-blend-soft-light select-none pointer-events-none" 
        />
      </div>
      {/* ------------------------------- */}

      {/* Main Application Layout (z-10 ensures it's above backgrounds) */}
      <div className="relative z-10 flex w-full h-full">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <TopNavigation />
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative custom-scrollbar">
            <div className="max-w-7xl mx-auto h-full flex flex-col relative z-20">
              {children}
              <Footer />
            </div>
          </main>
        </div>
      </div>

      {/* Floating UI Elements */}
      <FloatingAiMascot />
      
    </div>
  );
}
