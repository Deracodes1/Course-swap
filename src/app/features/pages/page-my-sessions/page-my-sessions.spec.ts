import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageMySessions } from './page-my-sessions';

describe('PageMySessions', () => {
  let component: PageMySessions;
  let fixture: ComponentFixture<PageMySessions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageMySessions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageMySessions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
