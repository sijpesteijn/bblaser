import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnimationDetailsComponent } from './animation-details.component';

describe('AnimationDetailsComponent', () => {
  let component: AnimationDetailsComponent;
  let fixture: ComponentFixture<AnimationDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
