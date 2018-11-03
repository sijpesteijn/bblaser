import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'bb-edit-value',
  templateUrl: './edit-value.component.html',
  styleUrls: ['./edit-value.component.scss']
})
export class EditValueComponent implements OnInit {
  @Input('name')
  name: string;
  private edit: false;
  @Output()
  onClick = new EventEmitter();
  @Output()
  onChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  nameCLicked() {
    this.onClick.emit();
  }

  save($event: any) {
    if ($event.keyCode === 13) {
      this.onChange.emit(($event.srcElement as any).value);
      this.edit = false;
    }
  }
}
