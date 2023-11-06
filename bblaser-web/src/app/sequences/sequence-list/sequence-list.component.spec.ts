import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SequenceListComponent } from './sequence-list.component';

describe('SequenceListComponent', () => {
  let component: SequenceListComponent;
  let fixture: ComponentFixture<SequenceListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SequenceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SequenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
