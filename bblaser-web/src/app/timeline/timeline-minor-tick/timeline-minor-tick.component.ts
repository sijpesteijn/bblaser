import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Tick } from '../timeline.component';

@Component({
  selector: 'bb-timeline-minor-tick',
  template: `
    <div #minor></div>
  `,
  styles: [`
    div {
      position: absolute;
      bottom: 0px;
      width: 1px;
      height: 4px;
      background-color: #444;
    }
  `]
})
export class TimelineMinorTickComponent implements OnChanges {
  @ViewChild('minor', { static: true })
  private minor: ElementRef;
  @Input()
  private tick: Tick;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.minor.nativeElement.style.setProperty('left', this.tick.offset + 'px');
  }

}
