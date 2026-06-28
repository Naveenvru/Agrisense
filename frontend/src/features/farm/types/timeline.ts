export type TimelineEventType = 'Planting' | 'Growing' | 'Flowering' | 'Fruit Development' | 'Harvest' | 'Completed' | 'Sold';

export interface TimelineEvent {
  id: string;
  farmId: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  date: string;
  isCompleted: boolean;
  isCurrent: boolean;
}
