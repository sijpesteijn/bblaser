import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges, HostListener, AfterViewInit
} from '@angular/core';
import { BBColor } from '../../animations/animation.service';
import { RotatorOptions } from '../radial-color-rotator.directive';

@Component({
  selector: 'bb-radial-color-picker',
  template: `
    <div class="radial-color-picker"
         [ngStyle]="{'width.px': size, 'height.px': size}">
      <div class="color-palette"
           bbRadialColorGradient
           [ngClass]="{'blur-palette-out': !color_open, 'blur-palette-in': color_open}"
           [ngStyle]="{
                'opacity' : 0.8,
                'width.px': ringSize,
                'height.px': ringSize,
                'margin-top.px': ringOffset,
                'margin-left.px': ringOffset}"></div>
      <div id="ruleta" class="rotator"
           #rotator
           [ngStyle]="{
                'width.px': ringSize,
                'height.px': ringSize,
                'margin-top.px': ringOffset,
                'margin-left.px': ringOffset}">
        <div class="rotator-knob"
             bbRadialColorRotator
             [options]="rotatorOptions" (rotatorDrag)="handleRotatorDrag($event)"
             [ngClass]="{'rotator-knob-zoom-out': !color_open, 'rotator-knob-zoom-in': color_open}"></div>
      </div>
      <div class="color-shadow" #colorShadow></div>
      <button type="button"
              class="color"
              matTooltip="{{toolTip}}"
              #color
              (click)="colorSelClick()"></button>
    </div>
  `,
  styleUrls: ['./radial-color-picker.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadialColorPickerComponent implements OnChanges, AfterViewInit {
  @Input()
  color: BBColor;
  @Input()
  toolTip: string;
  @Input()
  size = 15;
  ringSize = 100;
  ringOffset = -43;
  @ViewChild('color')
  colorElement: ElementRef<HTMLDivElement>;
  @ViewChild('rotator')
  rotatorElement: ElementRef<HTMLDivElement>;
  color_open = false;
  rotatorOptions: RotatorOptions = {
    angle:  0,
    speed: 0,
    inertia: 0.7,
    minimalSpeed: 0.0087,
    minimalAngleChange: 0.0087
  };
  propellor: any;

  constructor() {
  }

  ngAfterViewInit() {
    // this.propellor = new Propeller(document.getElementById("ruleta"), this.rotatorOptions);
  }

  @HostListener('wheel', ['$event'])
  public handleScroll(event: MouseWheelEvent): void {
    if (this.color_open) {
      event.stopPropagation();
      event.preventDefault();
      this.rotatorOptions.angle += event.deltaY;
      this.propellor.angle = this.rotatorOptions.angle;
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.color) {
      const rgbColor = 'rgb(' + this.color.red + ',' + this.color.green + ',' + this.color.blue + ')';
      this.colorElement.nativeElement.style.setProperty('background-color', rgbColor);
    }
    if (changes.size) {
      this.ringSize = this.size * 4;
      this.ringOffset = -39;
    }
  }

  colorSelClick() {
    this.color_open = !this.color_open;
  }

  handleRotatorDrag(angle: number) {
    console.log('Angle ', angle);
  }

}
