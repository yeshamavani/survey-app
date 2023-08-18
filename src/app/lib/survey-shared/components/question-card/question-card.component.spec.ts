import {ComponentFixture, TestBed} from '@angular/core/testing';

import {QuestionCardComponent} from './question-card.component';

describe('QuestionCardComponent', () => {
  let component: QuestionCardComponent;
  let fixture: ComponentFixture<QuestionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
