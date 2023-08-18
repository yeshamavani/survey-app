import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {InputButtonComponent} from './input-button.component';

describe('InputButtonComponent', () => {
  let component: InputButtonComponent;
  let fixture: ComponentFixture<InputButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InputButtonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
