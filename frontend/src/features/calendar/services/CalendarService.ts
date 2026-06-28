import { Task, CropTimelineEvent, CalendarStats } from '../types';
import { MOCK_TASKS, MOCK_TIMELINES, MOCK_CALENDAR_STATS } from '../mocks/calendar.mock';

export class CalendarService {
  static async getStats(): Promise<CalendarStats> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_CALENDAR_STATS;
  }

  static async getTodayTasks(): Promise<Task[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const todayStr = new Date().toISOString().split('T')[0];
    return MOCK_TASKS.filter(t => t.date === todayStr);
  }

  static async getUpcomingTasks(): Promise<Task[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const todayStr = new Date().toISOString().split('T')[0];
    return MOCK_TASKS.filter(t => t.date > todayStr).sort((a, b) => a.date.localeCompare(b.date));
  }
  
  static async getOverdueTasks(): Promise<Task[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return MOCK_TASKS.filter(t => t.status === 'Overdue');
  }

  static async getCalendarEvents(start: string, end: string): Promise<Task[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_TASKS.filter(t => t.date >= start && t.date <= end);
  }

  static async getCropTimeline(crop: string): Promise<CropTimelineEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 700));
    return MOCK_TIMELINES.filter(tl => tl.crop === crop);
  }
}
