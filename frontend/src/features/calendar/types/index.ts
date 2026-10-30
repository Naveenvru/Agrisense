export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical' | 'Not recorded';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue' | 'Cancelled';
export type TaskType = 'Irrigation' | 'Fertilizer Application' | 'Pest Inspection' | 'Disease Monitoring' | 'Harvest' | 'Soil Testing' | 'Other';
export type CropType = 'Tomato' | 'Paddy' | 'Onion' | 'Wheat' | 'Other';

export interface WeatherImpact {
  condition: 'Rain' | 'Wind' | 'Heat' | 'Frost' | 'Optimal';
  effect: 'Delay' | 'Accelerate' | 'Modify' | 'Proceed';
  recommendation: string;
}

export interface AiRecommendation {
  title: string;
  suggestion: string;
  confidence: number;
  reason: string;
}

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  date: string; // ISO date string
  time: string; // e.g. "08:00 AM"
  priority: TaskPriority;
  status: TaskStatus;
  farmId: string;
  farmName: string;
  parcelId: string;
  parcelName: string;
  crop: CropType;
  estimatedDuration: string; // e.g. "2 hours"
  requiredEquipment: string[];
  notes?: string;
  weatherImpact?: WeatherImpact;
  aiRecommendation?: AiRecommendation;
}

export type TimelineStage = 'Planting' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Harvest';

export interface CropTimelineEvent {
  id: string;
  crop: CropType;
  stage: TimelineStage | null;
  expectedDate: string;
  isCurrent: boolean;
  isCompleted: boolean;
  description: string;
}

export interface CalendarStats {
  dueToday: number;
  highPriority: number;
  upcomingHarvests: number;
  weatherRisk: string;
  aiPlanningStatus: 'Optimal' | 'Requires Attention' | 'Critical' | 'Not available';
}

export interface CalendarFilterState {
  farm: string | 'all';
  crop: string | 'all';
  priority: string | 'all';
  status: string | 'all';
  taskType: string | 'all';
  search: string;
}
