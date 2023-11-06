import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnimationCanvasComponent } from './animation-canvas.component';

describe('AnimationCanvasComponent', () => {
  let component: AnimationCanvasComponent;
  let fixture: ComponentFixture<AnimationCanvasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimationCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
