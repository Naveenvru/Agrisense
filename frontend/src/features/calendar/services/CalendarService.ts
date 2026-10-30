import { Task, CropTimelineEvent, CalendarStats, TaskPriority, TaskType, CropType } from '../types';
import { apiClient } from '@/lib/axios';

export class CalendarService {
  static async getCalendarEvents(start?: string, end?: string): Promise<Task[]> {
    const response = await apiClient.get('/calendar');
      const events = response.data?.data || response.data || [];
      if (!Array.isArray(events)) return [];

      const tasks: Task[] = events.map((e: any) => {
        const eventDateStr = e.eventDate ? new Date(e.eventDate).toISOString().split('T')[0] : '';
        const todayStr = new Date().toISOString().split('T')[0];
        let status: 'Pending' | 'Completed' | 'Overdue' = 'Pending';
        if (e.isCompleted) {
          status = 'Completed';
        } else if (eventDateStr && eventDateStr < todayStr) {
          status = 'Overdue';
        }

        const cropName = e.farmerCrop?.crop?.cropName || e.farmerCrop?.cropVariety || 'Other';

        return {
          id: String(e.id),
          title: e.taskName || 'Untitled registered activity',
          type: (e.type || 'Other') as TaskType,
          date: eventDateStr,
          time: e.time || 'Time not recorded',
          priority: (e.priority || 'Not recorded') as TaskPriority,
          status,
          farmId: String(e.farmerCrop?.parcel?.id || ''),
          farmName: e.farmerCrop?.parcel?.parcelName || 'Farm name not recorded',
          parcelId: String(e.farmerCrop?.parcel?.id || ''),
          parcelName: e.farmerCrop?.parcel?.parcelName || 'Parcel name not recorded',
          crop: (['Tomato', 'Paddy', 'Onion', 'Wheat'].includes(cropName) ? cropName : 'Other') as CropType,
          estimatedDuration: e.estimatedDuration || 'Not recorded',
          requiredEquipment: [],
          notes: e.taskDescription || ''
        };
      });

      if (start && end) {
        return tasks.filter(t => t.date >= start && t.date <= end);
      }
    return tasks;
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
      weatherRisk: 'Not available',
      aiPlanningStatus: 'Not available',
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

    return filtered.map((e) => ({
      id: e.id,
      crop: e.crop,
      stage: null,
      expectedDate: e.date,
      isCurrent: e.date === new Date().toISOString().split('T')[0],
      isCompleted: e.status === 'Completed',
      description: e.notes || e.title
    }));
  }
}

