import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserProfile } from '../../core/models/user-models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject$ = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject$.asObservable();

  constructor() {
    // Optional: Check localStorage on init to persist local prototype sessions
    const savedUser = localStorage.getItem('cs_user_session');
    if (savedUser) {
      this.currentUserSubject$.next(JSON.parse(savedUser));
    }
  }
  // get snapshotUser(): UserProfile | null {
  //   return this.currentUserSubject$.value;
  // }
  get currentUserSnapshot(): UserProfile | null {
    return this.currentUserSubject$.value;
  }

  // Phase 1: Authentication Creation/Entry
  setAuthUser(name: string, email: string): void {
    const newUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: name,
      email: email,
      rating: 5.0, // Default perfect rating for newcomers
      sessionsCompleted: 0,
      isOnboarded: false,
    };
    this.updateAndPersist(newUser);
  }

  // Phase 2: Complete Profile metadata via Onboarding Wizard
  completeOnboarding(onboardingData: {
    intent: 'Teach' | 'Learn' | 'Both';
    department: string;
    level: string;
    canTeach: string[];
    needsHelpWith: string[];
    availability: ('Weekdays' | 'Weekends')[];
  }): void {
    const current = this.currentUserSnapshot;
    if (!current) return;

    const fullyOnboardedUser: UserProfile = {
      ...current,
      ...onboardingData,
      isOnboarded: true,
    };
    this.updateAndPersist(fullyOnboardedUser);
  }

  logout(): void {
    localStorage.removeItem('cs_user_session');
    this.currentUserSubject$.next(null);
  }

  private updateAndPersist(user: UserProfile): void {
    localStorage.setItem('cs_user_session', JSON.stringify(user));
    this.currentUserSubject$.next(user);
  }
}
