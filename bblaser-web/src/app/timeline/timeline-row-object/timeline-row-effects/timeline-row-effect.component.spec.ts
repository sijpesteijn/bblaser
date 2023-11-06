import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimelineRowEffectComponent } from './timeline-row-effect.component';

describe('TimelineRowEffectComponent', () => {
  let component: TimelineRowEffectComponent;
  let fixture: ComponentFixture<TimelineRowEffectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineRowEffectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineRowEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
