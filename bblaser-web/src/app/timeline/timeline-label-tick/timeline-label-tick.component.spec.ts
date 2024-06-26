import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimelineLabelTickComponent } from './timeline-label-tick.component';

describe('TimelineLabelTickComponent', () => {
  let component: TimelineLabelTickComponent;
  let fixture: ComponentFixture<TimelineLabelTickComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineLabelTickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineLabelTickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
