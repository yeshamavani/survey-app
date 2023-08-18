import {ComponentFixture, TestBed} from '@angular/core/testing';

import {QuestionSettingSectionComponent} from './question-setting-section.component';

describe('QuestionSettingSectionComponent', () => {
  let component: QuestionSettingSectionComponent;
  let fixture: ComponentFixture<QuestionSettingSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionSettingSectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSettingSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
