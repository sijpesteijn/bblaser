import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimelineMajorTickComponent } from './timeline-major-tick.component';

describe('TimelineMajorTickComponent', () => {
  let component: TimelineMajorTickComponent;
  let fixture: ComponentFixture<TimelineMajorTickComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineMajorTickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineMajorTickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
