import {ComponentFixture, TestBed} from '@angular/core/testing';

import {QuestionDropSectionComponent} from './question-drop-section.component';

describe('QuestionDropSectionComponent', () => {
  let component: QuestionDropSectionComponent;
  let fixture: ComponentFixture<QuestionDropSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionDropSectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionDropSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
