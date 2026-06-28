import { Task, CropTimelineEvent, CalendarStats } from '../types';

export const MOCK_CALENDAR_STATS: CalendarStats = {
  dueToday: 4,
  highPriority: 2,
  upcomingHarvests: 1,
  weatherRisk: 'Rain Expected',
  aiPlanningStatus: 'Requires Attention'
};

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split('T')[0];

const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const yesterdayStr = yesterday.toISOString().split('T')[0];

const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 5);
const nextWeekStr = nextWeek.toISOString().split('T')[0];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Morning Irrigation',
    type: 'Irrigation',
    date: todayStr,
    time: '06:00 AM',
    priority: 'Critical',
    status: 'Pending',
    farmId: 'f1',
    farmName: 'Sunny Valley Farm',
    parcelId: 'p1',
    parcelName: 'North Field',
    crop: 'Tomato',
    estimatedDuration: '2 hours',
    requiredEquipment: ['Drip Irrigation System'],
    notes: 'Ensure soil moisture reaches 40%',
    weatherImpact: {
      condition: 'Rain',
      effect: 'Delay',
      recommendation: 'Delay irrigation due to expected rainfall.'
    },
    aiRecommendation: {
      title: 'Delay Irrigation',
      suggestion: 'Delay irrigation until tomorrow morning.',
      confidence: 94,
      reason: 'Rain forecast in next 24 hours (12mm expected).'
    }
  },
  {
    id: 't2',
    title: 'Nitrogen Fertilizer Application',
    type: 'Fertilizer Application',
    date: todayStr,
    time: '09:00 AM',
    priority: 'High',
    status: 'In Progress',
    farmId: 'f2',
    farmName: 'Riverbed Acres',
    parcelId: 'p3',
    parcelName: 'East Field',
    crop: 'Paddy',
    estimatedDuration: '4 hours',
    requiredEquipment: ['Tractor', 'Fertilizer Spreader'],
    notes: 'Apply NPK 20-20-20 at 50kg/ha'
  },
  {
    id: 't3',
    title: 'Whitefly Pest Inspection',
    type: 'Pest Inspection',
    date: todayStr,
    time: '02:00 PM',
    priority: 'Medium',
    status: 'Completed',
    farmId: 'f1',
    farmName: 'Sunny Valley Farm',
    parcelId: 'p2',
    parcelName: 'South Field',
    crop: 'Tomato',
    estimatedDuration: '1 hour',
    requiredEquipment: ['Magnifying Glass', 'Trap Sheets']
  },
  {
    id: 't4',
    title: 'Soil pH Testing',
    type: 'Soil Testing',
    date: yesterdayStr,
    time: '10:00 AM',
    priority: 'High',
    status: 'Overdue',
    farmId: 'f3',
    farmName: 'Hilltop Orchards',
    parcelId: 'p5',
    parcelName: 'Upper Terrace',
    crop: 'Wheat',
    estimatedDuration: '2 hours',
    requiredEquipment: ['Soil Test Kit']
  },
  {
    id: 't5',
    title: 'Harvesting',
    type: 'Harvest',
    date: nextWeekStr,
    time: '07:00 AM',
    priority: 'Critical',
    status: 'Pending',
    farmId: 'f2',
    farmName: 'Riverbed Acres',
    parcelId: 'p4',
    parcelName: 'West Field',
    crop: 'Onion',
    estimatedDuration: '8 hours',
    requiredEquipment: ['Harvester', 'Storage Crates']
  },
  {
    id: 't6',
    title: 'Preventative Spraying',
    type: 'Disease Monitoring',
    date: tomorrowStr,
    time: '08:00 AM',
    priority: 'Medium',
    status: 'Pending',
    farmId: 'f1',
    farmName: 'Sunny Valley Farm',
    parcelId: 'p1',
    parcelName: 'North Field',
    crop: 'Tomato',
    estimatedDuration: '3 hours',
    requiredEquipment: ['Sprayer', 'PPE'],
    weatherImpact: {
      condition: 'Wind',
      effect: 'Delay',
      recommendation: 'Avoid spraying due to strong winds.'
    }
  }
];

export const MOCK_TIMELINES: CropTimelineEvent[] = [
  { id: 'tl1', crop: 'Tomato', stage: 'Planting', expectedDate: '2026-05-01', isCurrent: false, isCompleted: true, description: 'Seeds sown in nursery' },
  { id: 'tl2', crop: 'Tomato', stage: 'Vegetative', expectedDate: '2026-05-20', isCurrent: false, isCompleted: true, description: 'Transplanted to main field' },
  { id: 'tl3', crop: 'Tomato', stage: 'Flowering', expectedDate: todayStr, isCurrent: true, isCompleted: false, description: 'First blooms appearing' },
  { id: 'tl4', crop: 'Tomato', stage: 'Fruiting', expectedDate: nextWeekStr, isCurrent: false, isCompleted: false, description: 'Fruit development phase' },
  { id: 'tl5', crop: 'Tomato', stage: 'Harvest', expectedDate: '2026-07-15', isCurrent: false, isCompleted: false, description: 'Expected harvest window' },
];
