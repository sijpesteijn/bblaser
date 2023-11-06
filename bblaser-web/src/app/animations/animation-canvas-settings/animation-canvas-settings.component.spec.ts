import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnimationCanvasSettingsComponent } from './animation-canvas-settings.component';

describe('AnimationCanvasSettingsComponent', () => {
  let component: AnimationCanvasSettingsComponent;
  let fixture: ComponentFixture<AnimationCanvasSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimationCanvasSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationCanvasSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
