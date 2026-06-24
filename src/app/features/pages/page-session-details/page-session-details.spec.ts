import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSessionDetails } from './page-session-details';

describe('PageSessionDetails', () => {
  let component: PageSessionDetails;
  let fixture: ComponentFixture<PageSessionDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageSessionDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageSessionDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
