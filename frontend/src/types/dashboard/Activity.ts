export interface ActivityData {
  id: string;
  time: string;
  description: string;
  type: 'weather' | 'market' | 'prediction' | 'harvest' | 'auth' | 'system';
}
