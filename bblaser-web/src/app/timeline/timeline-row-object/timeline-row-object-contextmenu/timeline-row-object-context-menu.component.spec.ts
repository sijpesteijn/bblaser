import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimelineRowObjectContextMenuComponent } from './timeline-row-object-context-menu.component';

describe('TimelineRowObjectContextMenuComponent', () => {
  let component: TimelineRowObjectContextMenuComponent;
  let fixture: ComponentFixture<TimelineRowObjectContextMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineRowObjectContextMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineRowObjectContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
