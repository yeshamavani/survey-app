import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NoQuestionAddedComponent} from './no-question-added.component';

describe('NoQuestionAddedComponent', () => {
  let component: NoQuestionAddedComponent;
  let fixture: ComponentFixture<NoQuestionAddedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoQuestionAddedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoQuestionAddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
