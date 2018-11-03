import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Tick } from '../timeline.component';

@Component({
  selector: 'bb-timeline-label-tick',
  template: `
    <div #label class="label"></div>
    <div #labelText class="label-text">{{tick.label}}</div>
  `,
  styles: [`
    .label {
      position: absolute;
      top: 0px;
      width: 1px;
      height: 100%;
      text-indent: 1px;
      background-color: #444;
    }
    .label-text {
      position: absolute;
      top: -4px;
      color: #444;
      font-size: 10px;
    }
  `]
})
export class TimelineLabelTickComponent implements OnChanges {
  @ViewChild('label')
  private label: ElementRef;
  @ViewChild('labelText')
  private labelText: ElementRef;
  @Input()
  tick: Tick;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.label.nativeElement.style.setProperty('left', this.tick.offset + 'px');
    this.labelText.nativeElement.style.setProperty('left', (this.tick.offset + 3) + 'px');
  }

}
