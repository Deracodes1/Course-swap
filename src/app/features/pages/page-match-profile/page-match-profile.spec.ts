import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageMatchProfile } from './page-match-profile';

describe('PageMatchProfile', () => {
  let component: PageMatchProfile;
  let fixture: ComponentFixture<PageMatchProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageMatchProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageMatchProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
