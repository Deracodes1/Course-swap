import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthEntry } from './auth-entry';

describe('AuthEntry', () => {
  let component: AuthEntry;
  let fixture: ComponentFixture<AuthEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthEntry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthEntry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
