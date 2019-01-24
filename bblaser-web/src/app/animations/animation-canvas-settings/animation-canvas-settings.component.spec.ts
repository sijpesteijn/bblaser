import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationCanvasSettingsComponent } from './animation-canvas-settings.component';

describe('AnimationCanvasSettingsComponent', () => {
  let component: AnimationCanvasSettingsComponent;
  let fixture: ComponentFixture<AnimationCanvasSettingsComponent>;

  beforeEach(async(() => {
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
