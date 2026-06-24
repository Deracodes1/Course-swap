import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDbService, Session } from './../../../core/services/mock-db.service';
import { Observable, map } from 'rxjs';

// Unified type representation matching the expanded tab navigation track
export type SessionTabType = 'All' | 'Confirmed' | 'Pending' | 'Completed';

@Component({
  selector: 'app-page-my-sessions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-my-sessions.html',
  styleUrl: './page-my-sessions.css',
})
export class PageMySessions implements OnInit {
  sessions$!: Observable<Session[]>;
  activeTab: SessionTabType = 'All'; // Defaults directly to the multi-view layout pane

  constructor(private db: MockDbService) {}

  ngOnInit(): void {
    this.fetchFilteredSessions();
  }

  setTab(tab: SessionTabType): void {
    this.activeTab = tab;
    this.fetchFilteredSessions();
  }

  private fetchFilteredSessions(): void {
    this.sessions$ = this.db.getSessions().pipe(
      map((sessions) => {
        // Render everything unfiltered if 'All' is active
        if (this.activeTab === 'All') {
          return sessions;
        }
        // Match explicit status parameters otherwise
        return sessions.filter((s) => s.status === this.activeTab);
      }),
    );
  }

  // Acceptance Criteria Action Trigger Handler
  viewSessionDetails(session: Session): void {
    console.log(
      `Inspecting full contextual metadata card for session sequence identifier: ${session.id}`,
    );
    alert(
      `Opening detailed context modal for ${session.courseCode} with ${session.partnerName}.\nFormat: ${session.format}\nNotes: ${session.notes || 'None provided.'}`,
    );
  }
}
