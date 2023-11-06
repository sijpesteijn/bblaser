import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SequenceEditComponent } from './sequence-edit.component';

describe('SequenceEditComponent', () => {
  let component: SequenceEditComponent;
  let fixture: ComponentFixture<SequenceEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SequenceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SequenceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
