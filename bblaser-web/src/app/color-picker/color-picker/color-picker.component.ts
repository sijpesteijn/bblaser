import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { BBColor } from '../../animations/animation.service';

@Component({
  selector: 'bb-color-picker',
  template: `
    <div class="color-picker-container">
      <span class="color" #color matTooltip="{{toolTip}}" (click)="setPicker()"></span>
    </div>
  `,
  styles: [`
    .color-picker-container {
      display: flex;
    }

    .color {
      width: 13px;
      height: 13px;
      border-radius: 20px;
      margin-right: 3px;
      border: 1px solid #b4b4b4;
    }
  `]
})
export class ColorPickerComponent implements OnChanges {
  @Input()
  toolTip = 'Click to select color';
  @Input()
  color: BBColor;
  @ViewChild('color')
  colorElement: ElementRef;
  showPicker = false;

  constructor() { }

  ngOnChanges() {
    const rgbColor = 'rgb(' + this.color.red + ',' + this.color.green + ',' + this.color.blue + ')';
    this.colorElement.nativeElement.style.setProperty('background-color',rgbColor);
  }

  setPicker() {
    this.showPicker = !this.showPicker;
  }
}
