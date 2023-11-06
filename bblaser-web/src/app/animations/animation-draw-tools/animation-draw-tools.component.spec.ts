import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnimationDrawToolsComponent } from './animation-draw-tools.component';

describe('AnimationDrawToolsComponent', () => {
  let component: AnimationDrawToolsComponent;
  let fixture: ComponentFixture<AnimationDrawToolsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimationDrawToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationDrawToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
