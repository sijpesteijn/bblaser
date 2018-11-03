import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineRowObjectContextmenuComponent } from './timeline-row-object-contextmenu.component';

describe('TimelineRowObjectContextmenuComponent', () => {
  let component: TimelineRowObjectContextmenuComponent;
  let fixture: ComponentFixture<TimelineRowObjectContextmenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineRowObjectContextmenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineRowObjectContextmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
