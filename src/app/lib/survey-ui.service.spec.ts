import { TestBed } from '@angular/core/testing';

import { SurveyUiService } from './survey-ui.service';

describe('SurveyUiService', () => {
  let service: SurveyUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurveyUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
