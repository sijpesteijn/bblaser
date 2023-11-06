import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'bb-edit-value',
  template: `
    <span *ngIf="!edit"><span [innerHTML]="name" (click)="nameCLicked()"></span><mat-icon (click)="edit = true">edit</mat-icon></span>
    <span *ngIf="edit"><mat-form-field><input matInput [value]="name" (keyup)="save($event)"></mat-form-field></span>
  `,
  styles: [``]
})
export class EditValueComponent {
  @Input()
  name: string;
  edit: boolean = false;
  @Output()
  click = new EventEmitter();
  @Output()
  change = new EventEmitter();

  nameCLicked() {
    this.click.emit();
  }

  save($event: any) {
    if ($event.keyCode === 13) {
      this.change.emit(($event.srcElement as any).value);
      this.edit = false;
    }
  }
}
