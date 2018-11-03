import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationEditComponent } from './animation-edit.component';

describe('AnimationEditComponent', () => {
  let component: AnimationEditComponent;
  let fixture: ComponentFixture<AnimationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimationEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
