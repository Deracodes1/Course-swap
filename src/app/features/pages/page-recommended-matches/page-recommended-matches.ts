import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, debounceTime, startWith, switchMap } from 'rxjs';
import { MockDbService } from '../../../core/services/mock-db.service';
import { UserProfile } from '../../../core/models/user-models';

@Component({
  selector: 'app-page-recommended-matches',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './page-recommended-matches.html',
  styleUrl: './page-recommended-matches.css',
})
export class PageRecommendedMatches implements OnInit {
  searchControl = new FormControl('');
  filteredMatches$!: Observable<UserProfile[]>;

  constructor(
    private db: MockDbService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.filteredMatches$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      switchMap((query) => this.db.getMatches(query || '')),
    );
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  viewProfile(tutor: UserProfile): void {
    this.router.navigate(['/match-profile', tutor.id]);
  }
}