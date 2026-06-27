
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ 
  title = "Failed to load data", 
  message = "An unexpected error occurred while fetching data.", 
  onRetry,
  className = ""
}: ErrorStateProps) {
  return (
    <Card className={`glass border-error/50 bg-error/5 ${className}`}>
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="w-10 h-10 text-error mb-4" />
        <h3 className="text-lg font-heading font-medium text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary text-sm max-w-sm mb-6">{message}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="gap-2 border-error/50 text-error hover:bg-error/10">
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
