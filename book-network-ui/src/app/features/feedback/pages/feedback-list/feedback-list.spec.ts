import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackList } from './feedback-list';

describe('FeedbackList', () => {
  let component: FeedbackList;
  let fixture: ComponentFixture<FeedbackList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackList],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
