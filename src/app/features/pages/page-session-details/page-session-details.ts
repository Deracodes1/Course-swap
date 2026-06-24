import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MockDbService, Session } from '../../../core/services/mock-db.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-page-session-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './page-session-details.html',
  styleUrl: './page-session-details.css',
})
export class PageSessionDetails implements OnInit {
  sessionId!: string | null;
  sessionData: Session | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: MockDbService,
  ) {}

  ngOnInit(): void {
    // 1. Synchronously pluck the :id string param straight out of the active URL path
    this.sessionId = this.route.snapshot.paramMap.get('id');

    if (this.sessionId) {
      // 2. Query our shared memory stream for a matching item
      this.db
        .getSessions()
        .pipe(take(1))
        .subscribe((sessions) => {
          this.sessionData = sessions.find((s) => s.id === this.sessionId);

          // Safety Fallback: redirect if a student tries to access a non-existent ID
          if (!this.sessionData) {
            console.error(`Session sequence ID ${this.sessionId} not found.`);
            this.router.navigate(['/my-sessions']);
          }
        });
    } else {
      this.router.navigate(['/my-sessions']);
    }
  }

  goBack(): void {
    this.router.navigate(['/my-sessions']);
  }
}
