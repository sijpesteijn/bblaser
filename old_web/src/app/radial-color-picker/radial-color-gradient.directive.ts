import { Directive, ElementRef } from '@angular/core';

export interface Stop {
  color: number[];
  pos: number;
}

@Directive({
  selector: '[bbRadialColorGradient]'
})
export class RadialColorGradientDirective {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  eps = 0.00001;
  from = 0;
  deg = Math.PI / 180;
  size: number;
  stops: Stop[] = [
    { color: [255, 0, 0, 1], pos: 0 },
    { color: [255, 255, 0, 1], pos: 0.16666666666666666 },
    { color: [0, 255, 0, 1], pos: 0.33333333333333337 },
    { color: [0, 255, 255, 1], pos: 0.5 },
    { color: [0, 0, 255, 1], pos: 0.6666666666666666 },
    { color: [255, 0, 255, 1], pos: 0.8333333333333333 },
    { color: [255, 0, 0, 1], pos: 1 },
  ];

  constructor(private el: ElementRef<HTMLElement>) {
    this.canvas = (document.createElement('canvas') as HTMLCanvasElement);
    this.context = this.canvas.getContext('2d');
    this.size = el.nativeElement.offsetWidth || 280;
    this.canvas.width = this.canvas.height = this.size;
    el.nativeElement.style.background = this.getConicGradient();
    // el.nativeElement.style.backgroundColor = 'red';
  }

  getConicGradient(): string {
    const radius = Math.sqrt(2) * this.size / 2;
    const x = this.size / 2;
    let stopIndex = 0;
    let stop = this.stops[stopIndex], prevStop;
    let diff, t;

    this.context.translate(this.size / 2, this.size / 2);
    this.context.rotate(-90 * this.deg);
    this.context.rotate(this.from * this.deg);
    this.context.translate(-this.size / 2, -this.size / 2);

    for (let i = 0; i < 360;) {
      let sameColor;
      if (i / 360 + this.eps >= stop.pos) {
        do {
          prevStop = stop;
          stopIndex++;
          stop = this.stops[stopIndex];
        } while (stop && stop !== prevStop && stop.pos === prevStop.pos);

        if (!stop) {
          break;
        }

        sameColor = prevStop.color + '' === stop.color + '' && prevStop !== stop;

        diff = prevStop.color.map((c, index) => stop.color[index] - c);
      } else {
        sameColor = undefined;
      }

      t = (i / 360 - prevStop.pos) / (stop.pos - prevStop.pos);

      const interpolated = sameColor ? stop.color : diff.map((c, index) => {
        const ret = c * t + prevStop.color[index];
        return index < 3 ? ret & 255 : ret;
      });

      this.context.fillStyle = 'rgba(' + interpolated.join(',') + ')';
      this.context.beginPath();
      this.context.moveTo(x, x);

      const theta = sameColor ? 360 * (stop.pos - prevStop.pos) : 0.5;
      let beginArg = i * this.deg;
      beginArg = Math.min(360 * this.deg, beginArg);

      let endArg = beginArg + theta * this.deg;
      endArg = Math.min(360 * this.deg, endArg + 0.2);

      this.context.arc(x, x, radius, beginArg, endArg);
      this.context.closePath();
      this.context.fill();

      i += theta;
    }
    return 'url("' + this.getDataUrl() + '")';
  }

  getDataUrl() {
    return 'data:image/svg+xml,' + encodeURIComponent(this.getSVG());
  }

  getPng() {
    return this.canvas.toDataURL();
  }

  getSVG(): string {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none">' +
      '<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">' +
      '<image width="100" height="100%" xlink:href="' +
      this.getPng() +
      '" /></svg></svg>'
    );
  }
}
