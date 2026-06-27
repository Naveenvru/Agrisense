export interface TaskData {
  id: string;
  title: string;
  location: string;
  date: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
}
