import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RadialColorPickerComponent } from './radial-color-picker.component';

describe('RadialColorPickerComponent', () => {
  let component: RadialColorPickerComponent;
  let fixture: ComponentFixture<RadialColorPickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RadialColorPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadialColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
