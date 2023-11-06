import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditValueComponent } from './edit-value.component';

describe('EditValueComponent', () => {
  let component: EditValueComponent;
  let fixture: ComponentFixture<EditValueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
