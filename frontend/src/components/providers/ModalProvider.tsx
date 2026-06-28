import { createContext, useContext, useState, ReactNode } from 'react';
import { X, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Button } from '../ui/button';

export type ModalType = 'coming_soon' | 'success' | 'error' | 'confirm' | 'info';

interface ModalConfig {
  type: ModalType;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface ModalContextType {
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ModalConfig | null>(null);

  const openModal = (newConfig: ModalConfig) => {
    setConfig(newConfig);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setConfig(null), 200); // Wait for exit animation
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      
      {isOpen && config && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" onClick={closeModal} />
          <div className="relative bg-surface/90 border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 fade-in duration-200">
            <button onClick={closeModal} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors">
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center text-center mt-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                config.type === 'coming_soon' ? 'bg-primary/20 text-primary' :
                config.type === 'error' ? 'bg-error/20 text-error' :
                config.type === 'success' ? 'bg-success/20 text-success' : 'bg-info/20 text-info'
              }`}>
                {config.type === 'coming_soon' ? <Info className="w-6 h-6" /> :
                 config.type === 'error' ? <AlertCircle className="w-6 h-6" /> :
                 config.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <Info className="w-6 h-6" />}
              </div>
              
              <h2 className="text-xl font-bold text-text-primary mb-2">{config.title}</h2>
              <p className="text-sm text-text-secondary mb-6">{config.message}</p>
              
              <div className="flex gap-3 w-full">
                {config.type === 'confirm' && (
                  <Button variant="outline" className="flex-1" onClick={closeModal}>
                    {config.cancelText || 'Cancel'}
                  </Button>
                )}
                <Button className="flex-1" onClick={() => {
                  config.onConfirm?.();
                  closeModal();
                }}>
                  {config.confirmText || (config.type === 'confirm' ? 'Confirm' : 'Got it')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
