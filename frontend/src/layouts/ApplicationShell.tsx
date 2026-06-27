import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { Footer } from '@/components/layout/Footer';

export function ApplicationShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background text-text-primary overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopNavigation />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {children}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
