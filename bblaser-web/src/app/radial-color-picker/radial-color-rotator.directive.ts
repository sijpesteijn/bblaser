import { Directive, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

export interface RotatorOptions {
  angle: number;
  speed: number;
  inertia: number;
  minimalSpeed: number;
  minimalAngleChange: number;
}

@Directive({
  selector: '[bbRadialColorRotator]'
})
export class RadialColorRotatorDirective implements OnChanges {
  @Input('options')
  rotatorOptions: RotatorOptions;
  @Output()
  rotatorDrag: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.rotatorOptions = changes['options'].currentValue;

    }
  }

}
