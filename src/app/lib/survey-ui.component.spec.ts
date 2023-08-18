import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SurveyUiComponent} from './survey-ui.component';
import {RouterTestingModule} from '@angular/router/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('SurveyUiComponent', () => {
  let component: SurveyUiComponent;
  let fixture: ComponentFixture<SurveyUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SurveyUiComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
