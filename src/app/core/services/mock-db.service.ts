import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserProfile } from '../models/user-models';
import { Injectable } from '@angular/core';

export interface Session {
  id: string;
  courseCode: string;
  partnerName: string;
  dateTime: string;
  format: 'Physical Meeting' | 'Virtual Meeting';
  notes?: string;
  status: 'Confirmed' | 'Pending' | 'Completed';
}

@Injectable({
  providedIn: 'root',
})
export class MockDbService {
  private currentUser$ = new BehaviorSubject<UserProfile>({
    id: 'user_chinedu',
    name: 'Chinedu',
    email: 'chinedu@gmail.com',
    department: 'Mechanical Engineering',
    level: '200 Level',
    intent: 'Teach',
    canTeach: ['Mathematics'],
    needsHelpWith: ['Programming Fundamentals'],
    availability: ['Weekends'],
    rating: 0,
    sessionsCompleted: 0,
    isOnboarded: false,
  });

  private users$ = new BehaviorSubject<UserProfile[]>([
    {
      id: 'tutor_aria',
      name: 'Aria Larkspur',
      email: 'arialarks@gmail.com',
      department: 'Computer Science',
      level: 'Sophomore',
      canTeach: ['Algorithms', 'Data Structures', 'Java', 'Databases'],
      needsHelpWith: ['Statistics', 'Physics', 'Discrete Math', 'Linear Algebra'],
      availability: ['Weekdays', 'Weekends'],
      rating: 4.8,
      sessionsCompleted: 25,
      isOnboarded: true,
      matchPercentage: 85,
    },
    {
      id: 'tutor_kai',
      email: 'elowenkai@gmail.com',
      name: 'Kai Elowen',
      department: 'Mathematics',
      level: '300 Level',
      canTeach: ['Calculus', 'Linear Algebra'],
      needsHelpWith: ['Statistics', 'Probability'],
      availability: ['Weekdays'],
      rating: 4.9,
      sessionsCompleted: 14,
      isOnboarded: true,
      matchPercentage: 90,
    },
  ]);

  private sessions$ = new BehaviorSubject<Session[]>([
    {
      id: '1',
      courseCode: 'Calculus 101',
      partnerName: 'Elara Moon',
      dateTime: 'Oct 10, 3:00 PM',
      format: 'Physical Meeting',
      status: 'Confirmed',
    },
    {
      id: '2',
      courseCode: 'Physics 202',
      partnerName: 'Orion Vega',
      dateTime: 'Oct 12, 5:00 PM',
      format: 'Virtual Meeting',
      status: 'Pending',
    },
    {
      id: '3',
      courseCode: 'Literature 303',
      partnerName: 'Lyra Comet',
      dateTime: 'Oct 15, 1:00 PM',
      format: 'Physical Meeting',
      status: 'Completed',
    },
    {
      id: '4',
      courseCode: 'Chemistry 404',
      partnerName: 'Nova Star',
      dateTime: 'Oct 17, 11:00 AM',
      format: 'Virtual Meeting',
      status: 'Confirmed',
    },
    {
      id: '5',
      courseCode: 'Biology 505',
      partnerName: 'Sirius Orbit',
      dateTime: 'Oct 20, 2:00 PM',
      format: 'Physical Meeting',
      status: 'Pending',
    },
  ]);

  // Tracks followed user IDs in-session
  private followedUsers = new Set<string>();

  getCurrentUser(): Observable<UserProfile> {
    return this.currentUser$.asObservable();
  }

  getSessions(): Observable<Session[]> {
    return this.sessions$.asObservable();
  }

  addSession(session: Session): void {
    const currentSessions = this.sessions$.value;
    this.sessions$.next([...currentSessions, session]);
  }

  getMatches(searchQuery: string): Observable<UserProfile[]> {
    return this.users$.pipe(
      map((users) =>
        users.filter((user) => {
          const q = searchQuery.toLowerCase();
          const matchesQuery = searchQuery
            ? user.canTeach?.some((c) => c.toLowerCase().includes(q)) ||
              user.needsHelpWith?.some((c) => c.toLowerCase().includes(q)) ||
              user.department?.toLowerCase().includes(q)
            : true;
          return matchesQuery && user.id !== this.currentUser$.value.id;
        }),
      ),
    );
  }

  getUserById(id: string): Observable<UserProfile | undefined> {
    return this.users$.pipe(map((users) => users.find((u) => u.id === id)));
  }

  toggleFollow(userId: string): void {
    if (this.followedUsers.has(userId)) {
      this.followedUsers.delete(userId);
    } else {
      this.followedUsers.add(userId);
    }
  }

  isFollowing(userId: string): boolean {
    return this.followedUsers.has(userId);
  }

  bookSession(session: Omit<Session, 'id' | 'status'>): void {
    const newSession: Session = {
      ...session,
      id: Math.random().toString(36).substring(2),
      status: 'Pending',
    };
    this.sessions$.next([...this.sessions$.value, newSession]);
  }
}