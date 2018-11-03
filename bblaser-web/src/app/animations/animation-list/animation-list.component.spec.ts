
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationListComponent } from './animation-list.component';

describe('AnimationListComponent', () => {
  let component: AnimationListComponent;
  let fixture: ComponentFixture<AnimationListComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
