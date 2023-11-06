import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineRowEffectContextmenuComponent } from './timeline-row-effect-contextmenu.component';

describe('TimelineRowEffectContextmenuComponent', () => {
  let component: TimelineRowEffectContextmenuComponent;
  let fixture: ComponentFixture<TimelineRowEffectContextmenuComponent>;

  beforeEach(async(() => {
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
