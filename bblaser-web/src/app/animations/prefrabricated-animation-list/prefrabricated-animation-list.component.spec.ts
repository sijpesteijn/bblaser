import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefrabricatedAnimationListComponent } from './prefrabricated-animation-list.component';

describe('PrefrabricatedAnimationListComponent', () => {
  let component: PrefrabricatedAnimationListComponent;
  let fixture: ComponentFixture<PrefrabricatedAnimationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrefrabricatedAnimationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrefrabricatedAnimationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
