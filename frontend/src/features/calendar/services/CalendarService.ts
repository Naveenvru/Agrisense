import { Task, CropTimelineEvent, CalendarStats, TaskPriority, TaskType, CropType, TimelineStage } from '../types';
import { apiClient } from '@/lib/axios';

export class CalendarService {
  static async getCalendarEvents(start?: string, end?: string): Promise<Task[]> {
    try {
      const response = await apiClient.get('/calendar');
      const events = response.data?.data || response.data || [];
      if (!Array.isArray(events)) return [];

      const todayStr = new Date().toISOString().split('T')[0];

      const tasks: Task[] = events.map((e: any) => {
        const eventDateStr = e.eventDate ? new Date(e.eventDate).toISOString().split('T')[0] : todayStr;
        let status: 'Pending' | 'Completed' | 'Overdue' = 'Pending';
        if (e.isCompleted) {
          status = 'Completed';
        } else if (eventDateStr < todayStr) {
          status = 'Overdue';
        }

        const cropName = e.farmerCrop?.crop?.cropName || e.farmerCrop?.cropVariety || 'Other';

        return {
          id: String(e.id),
          title: e.taskName || 'Farm Task',
          type: (e.type || 'Other') as TaskType,
          date: eventDateStr,
          time: '08:00 AM',
          priority: 'Medium' as TaskPriority,
          status,
          farmId: String(e.farmerCrop?.parcel?.id || '1'),
          farmName: e.farmerCrop?.parcel?.parcelName || 'My Farm',
          parcelId: String(e.farmerCrop?.parcel?.id || '1'),
          parcelName: e.farmerCrop?.parcel?.parcelName || 'My Parcel',
          crop: (['Tomato', 'Paddy', 'Onion', 'Wheat'].includes(cropName) ? cropName : 'Other') as CropType,
          estimatedDuration: '1 hour',
          requiredEquipment: [],
          notes: e.taskDescription || ''
        };
      });

      if (start && end) {
        return tasks.filter(t => t.date >= start && t.date <= end);
      }
      return tasks;
    } catch (error) {
      return [];
    }
  }

  static async getStats(): Promise<CalendarStats> {
    const events = await this.getCalendarEvents();
    const todayStr = new Date().toISOString().split('T')[0];
    const dueToday = events.filter(e => e.date === todayStr && e.status !== 'Completed').length;
    const highPriority = events.filter(e => e.priority === 'High' || e.priority === 'Critical').length;
    const upcomingHarvests = events.filter(e => e.title.toLowerCase().includes('harvest')).length;

    return {
      dueToday,
      highPriority,
      upcomingHarvests,
      weatherRisk: events.length > 0 ? 'Low' : 'None',
      aiPlanningStatus: 'Optimal',
    };
  }

  static async getTodayTasks(): Promise<Task[]> {
    const events = await this.getCalendarEvents();
    const todayStr = new Date().toISOString().split('T')[0];
    return events.filter(t => t.date === todayStr);
  }

  static async getUpcomingTasks(): Promise<Task[]> {
    const events = await this.getCalendarEvents();
    const todayStr = new Date().toISOString().split('T')[0];
    return events.filter(t => t.date > todayStr).sort((a, b) => a.date.localeCompare(b.date));
  }

  static async getOverdueTasks(): Promise<Task[]> {
    const events = await this.getCalendarEvents();
    return events.filter(t => t.status === 'Overdue');
  }

  static async getCropTimeline(crop?: string): Promise<CropTimelineEvent[]> {
    const events = await this.getCalendarEvents();
    if (events.length === 0) return [];
    
    let filtered = events;
    if (crop) {
      filtered = events.filter(e => e.crop.toLowerCase() === crop.toLowerCase());
    }

    return filtered.map((e, idx) => ({
      id: e.id,
      crop: e.crop,
      stage: ('Vegetative') as TimelineStage,
      expectedDate: e.date,
      isCurrent: idx === 0,
      isCompleted: e.status === 'Completed',
      description: e.notes || e.title
    }));
  }
}

