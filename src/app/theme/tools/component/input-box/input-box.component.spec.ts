import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {InputBoxComponent} from './input-box.component';

describe('InputBoxComponent', () => {
  let component: InputBoxComponent;
  let fixture: ComponentFixture<InputBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InputBoxComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
