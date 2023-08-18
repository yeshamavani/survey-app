import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AlertToasterComponent} from './alert-toaster.component';

describe('AlertToasterComponent', () => {
  let component: AlertToasterComponent;
  let fixture: ComponentFixture<AlertToasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [AlertToasterComponent],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertToasterComponent);
    component = fixture.componentInstance;
    component.firstMsg = 'first-message';
    component.linkMsg = 'link-message';
    component.secondMsg = 'second-message';
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
