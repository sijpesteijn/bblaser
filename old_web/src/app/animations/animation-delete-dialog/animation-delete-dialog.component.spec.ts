import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationDeleteDialogComponent } from './animation-delete-dialog.component';

describe('AnimationDeleteDialogComponent', () => {
  let component: AnimationDeleteDialogComponent;
  let fixture: ComponentFixture<AnimationDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimationDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
