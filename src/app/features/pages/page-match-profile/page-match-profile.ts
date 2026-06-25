import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MockDbService } from '../../../core/services/mock-db.service';
import { UserProfile } from '../../../core/models/user-models';

@Component({
  selector: 'app-page-match-profile',
  imports: [CommonModule],
  templateUrl: './page-match-profile.html',
  styleUrl: './page-match-profile.css',
})
export class PageMatchProfile implements OnInit {
  tutor$!: Observable<UserProfile | undefined>;
  isFollowing = false;
  private tutorId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: MockDbService,
  ) {}

  ngOnInit(): void {
    this.tutorId = this.route.snapshot.paramMap.get('id') || '';
    this.tutor$ = this.db.getUserById(this.tutorId);
    this.isFollowing = this.db.isFollowing(this.tutorId);
  }

  toggleFollow(userId: string): void {
    this.db.toggleFollow(userId);
    this.isFollowing = this.db.isFollowing(userId);
  }

  requestSession(tutorId: string): void {
    this.router.navigate(['/booking-request'], { queryParams: { tutorId } });
  }
}