import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRecommendedMatches } from './page-recommended-matches';

describe('PageRecommendedMatches', () => {
  let component: PageRecommendedMatches;
  let fixture: ComponentFixture<PageRecommendedMatches>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageRecommendedMatches]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageRecommendedMatches);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
