export interface UserProfile {
  id: string;
  name: string;
  email: string;
  department?: string;
  level?: string;
  intent?: 'Teach' | 'Learn' | 'Both';
  canTeach?: string[];
  needsHelpWith?: string[];
  availability?: ('Weekdays' | 'Weekends')[];
  rating: number;
  sessionsCompleted: number;
  isOnboarded: boolean;
}
export interface Session {
  id: string;
  courseCode: string;
  partnerName: string;
  dateTime: string;
  status: 'Confirmed' | 'Pending' | 'Completed';
}
