import { ReactNode } from 'react';

export interface WidgetProps {
  title: string;
  icon?: ReactNode;
  status?: string;
  lastUpdated?: string;
  action?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export interface AsyncDataState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}
