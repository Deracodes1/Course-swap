import { Session } from '../../../core/models/user-models';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDbService } from './../../../core/services/mock-db.service';
import { Observable, map } from 'rxjs';
@Component({
  selector: 'app-page-my-sessions',
  imports: [CommonModule],
  templateUrl: './page-my-sessions.html',
  styleUrl: './page-my-sessions.css',
})
export class PageMySessions implements OnInit {
  sessions$!: Observable<Session[]>;
  activeTab: 'Confirmed' | 'Pending' | 'Completed' = 'Confirmed';

  constructor(private db: MockDbService) {}

  ngOnInit(): void {
    this.fetchFilteredSessions();
  }

  setTab(tab: 'Confirmed' | 'Pending' | 'Completed'): void {
    this.activeTab = tab;
    this.fetchFilteredSessions();
  }

  private fetchFilteredSessions(): void {
    this.sessions$ = this.db
      .getSessions()
      .pipe(map((sessions) => sessions.filter((s) => s.status === this.activeTab)));
  }

  // Interactive Quick Actions to demonstrate functional prototype mechanics
  triggerMockBookingAction(): void {
    this.db.bookSession({
      courseCode: 'Programming Fundamentals',
      partnerName: 'Aria Larkspur',
      dateTime: 'Oct 24, 2:00 PM',
    });
    this.setTab('Pending'); // Shifts view to Pending tab automatically to see the new record[cite: 1]
  }
}
