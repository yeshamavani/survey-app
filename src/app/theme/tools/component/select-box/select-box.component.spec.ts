import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';

import {SelectBoxComponent} from './select-box.component';

describe('SelectBoxComponent', () => {
  let component: SelectBoxComponent;
  let fixture: ComponentFixture<SelectBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SelectBoxComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
