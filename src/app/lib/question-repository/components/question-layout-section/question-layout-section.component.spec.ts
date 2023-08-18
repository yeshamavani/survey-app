import {ComponentFixture, TestBed} from '@angular/core/testing';

import {QuestionLayoutSectionComponent} from './question-layout-section.component';

describe('QuestionLayoutSectionComponent', () => {
  let component: QuestionLayoutSectionComponent;
  let fixture: ComponentFixture<QuestionLayoutSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionLayoutSectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionLayoutSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
