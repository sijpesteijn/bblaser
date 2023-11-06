import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimelineRowEffectContextmenuComponent } from './timeline-row-effect-contextmenu.component';

describe('TimelineRowEffectContextmenuComponent', () => {
  let component: TimelineRowEffectContextmenuComponent;
  let fixture: ComponentFixture<TimelineRowEffectContextmenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineRowEffectContextmenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineRowEffectContextmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
