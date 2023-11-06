import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Tick } from '../timeline.component';

@Component({
  selector: 'bb-timeline-major-tick',
  template: `
    <div #major></div>
  `,
  styles: [`
    div {
      position: absolute;
      bottom: 0px;
      width: 1px;
      height: 6px;
      background-color: #444;
    }
  `]
})
export class TimelineMajorTickComponent implements OnChanges {
  @ViewChild('major', { static: true })
  private major: ElementRef;

  @Input()
  private tick: Tick;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.major.nativeElement.style.setProperty('left', this.tick.offset + 'px');
  }

}
