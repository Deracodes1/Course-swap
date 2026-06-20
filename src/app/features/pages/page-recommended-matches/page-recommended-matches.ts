import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime, startWith, switchMap } from 'rxjs';
import { MockDbService } from '../../../core/services/mock-db.service';
import { UserProfile } from './../../../core/models/user-models';
@Component({
  selector: 'app-page-recommended-matches',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './page-recommended-matches.html',
  styleUrl: './page-recommended-matches.css',
})
export class PageRecommendedMatches implements OnInit {
  searchControl = new FormControl('');
  filteredMatches$!: Observable<UserProfile[]>;

  constructor(private db: MockDbService) {}

  ngOnInit(): void {
    this.filteredMatches$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200), // Optimizes response lag for low-end mobile devices
      switchMap((query) => this.db.getMatches(query || '')),
    );
  }

  viewProfile(tutor: UserProfile): void {
    // In a real app, route to booking drawer or profile view screen
    console.log('Open profile context context for:', tutor.name);
  }
}
