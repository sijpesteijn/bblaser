import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineRowEffectComponent } from './timeline-row-effect.component';

describe('TimelineRowEffectComponent', () => {
  let component: TimelineRowEffectComponent;
  let fixture: ComponentFixture<TimelineRowEffectComponent>;

  beforeEach(async(() => {
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
