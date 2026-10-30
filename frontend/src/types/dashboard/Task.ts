export interface TaskData {
  id: string;
  title: string;
  location: string;
  date: string;
  priority: 'High' | 'Medium' | 'Low' | 'Not recorded';
  status: 'Pending' | 'In Progress' | 'Completed';
}
