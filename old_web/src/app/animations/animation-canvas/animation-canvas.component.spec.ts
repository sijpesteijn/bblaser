import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationCanvasComponent } from './animation-canvas.component';

describe('AnimationCanvasComponent', () => {
  let component: AnimationCanvasComponent;
  let fixture: ComponentFixture<AnimationCanvasComponent>;

  beforeEach(async(() => {
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
