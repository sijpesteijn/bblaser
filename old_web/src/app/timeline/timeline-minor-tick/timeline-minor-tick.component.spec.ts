import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineMinorTickComponent } from './timeline-minor-tick.component';

describe('TimelineMinorTickComponent', () => {
  let component: TimelineMinorTickComponent;
  let fixture: ComponentFixture<TimelineMinorTickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineMinorTickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineMinorTickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
