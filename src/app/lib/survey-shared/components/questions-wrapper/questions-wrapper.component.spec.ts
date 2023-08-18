import {ComponentFixture, TestBed} from '@angular/core/testing';

import {QuestionsWrapperComponent} from './questions-wrapper.component';

describe('QuestionsWrapperComponent', () => {
  let component: QuestionsWrapperComponent;
  let fixture: ComponentFixture<QuestionsWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionsWrapperComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
