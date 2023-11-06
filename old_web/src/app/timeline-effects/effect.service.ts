import { Injectable, Type } from '@angular/core';
import { ShapeRotateEffect, ShapeRotateEffectComponent } from './shape-rotate-effect.component';
import { BBEffectData } from '../animations/animation.service';
import { ColorGradientEffect, ColorGradientEffectComponent } from './color-gradient-effect.component';
import { ShapeMoveEffect, ShapeMoveEffectComponent } from './shape-move-effect.component';
import { ShapeResizeEffect, ShapeResizeEffectComponent } from './shape-resize-effect.component';
import * as onecolor from 'onecolor';
import * as paper from 'paper';

export interface EffectInfo {
  type: string;
  name: string;
}

const COLOR_GRADIENT = 'color_gradient';
const SHAPE_MOVE = 'shape_move';
const SHAPE_RESIZE = 'shape_resize';
const SHAPE_ROTATE = 'shape_rotate';

@Injectable({
  providedIn: 'root'
})
export class EffectService {

  constructor() {
  }

  getEffectComponent(type: string): Type<any> {
    if (type === COLOR_GRADIENT) {
      return ColorGradientEffectComponent;
    } else if (type === SHAPE_MOVE) {
      return ShapeMoveEffectComponent;
    } else if (type === SHAPE_ROTATE) {
      return ShapeRotateEffectComponent;
    } else if (type === SHAPE_RESIZE) {
      return ShapeResizeEffectComponent;
    }
  }

  addNewEffect(type: string, duration: number): BBEffectData {
    if (type === COLOR_GRADIENT) {
      return {
        id: 1,
        type: COLOR_GRADIENT,
        name: 'gradient',
        start: 0,
        duration: duration,
        startColor: {red: 255, green: 0, blue: 0},
        endColor: {red: 255, green: 0, blue: 255}
      } as ColorGradientEffect;
    } else if (type === SHAPE_MOVE) {
      return {
        id: 1,
        type: SHAPE_MOVE,
        name: 'move',
        start: 0,
        duration: duration,
        startPosition: {x: 0, y: 0},
        endPosition: {x: 0, y: 0}
      } as ShapeMoveEffect;
    } else if (type === SHAPE_RESIZE) {
      return {
        id: 1,
        type: SHAPE_RESIZE,
        name: 'resize',
        start: 0,
        duration: duration,
        scale: 1
      } as ShapeResizeEffect;
    } else if (type === SHAPE_ROTATE) {
      return {
        id: 1,
        type: SHAPE_ROTATE,
        name: 'rotate',
        start: 0,
        duration: duration,
        degrees: 360
      } as ShapeRotateEffect;
    }
  }

  getEffectsInfo(): EffectInfo[] {
    return [
      {
        type: COLOR_GRADIENT,
        name: 'Gradient'
      },
      {
        type: SHAPE_MOVE,
        name: 'Move'
      },
      {
        type: SHAPE_RESIZE,
        name: 'Resize'
      },
      {
        type: SHAPE_ROTATE,
        name: 'Rotate'
      }
    ];

  }

  manipulatePath(path: paper.Path, effect: BBEffectData, appearanceStart: number, timelinePosition: number, scale: number) {
    if (effect.type === COLOR_GRADIENT) {
      const colorGradient = effect as ColorGradientEffect;
      const startColor = onecolor('rgb(' + colorGradient.startColor.red + ',' + colorGradient.startColor.green
        + ',' + colorGradient.startColor.blue + ')');
      const endColor = onecolor('rgb(' + colorGradient.endColor.red + ',' + colorGradient.endColor.green
        + ',' + colorGradient.endColor.blue + ')');
      const rDelta = (endColor.red() - startColor.red()) / (effect.duration + 1);
      const gDelta = (endColor.green() - startColor.green()) / (effect.duration + 1);
      const bDelta = (endColor.blue() - startColor.blue()) / (effect.duration + 1);
      const aDelta = (endColor.alpha() - startColor.alpha()) / (effect.duration + 1);
      const uColor = startColor
        .red(rDelta * (timelinePosition - appearanceStart - effect.start), true)
        .green(gDelta * (timelinePosition - appearanceStart - effect.start), true)
        .blue(bDelta * (timelinePosition - appearanceStart - effect.start), true)
        .alpha(aDelta * (timelinePosition - appearanceStart - effect.start), true).hex();
      path.strokeColor = uColor;
    } else if (effect.type === SHAPE_MOVE) {
      const shapeMove = effect as ShapeMoveEffect;
      const xStep = Math.abs(shapeMove.startPosition.x - shapeMove.endPosition.x) * scale / effect.duration;
      const yStep = Math.abs(shapeMove.startPosition.y - shapeMove.endPosition.y) * scale / effect.duration;
      path.translate(new paper.Point(xStep * (timelinePosition - appearanceStart - effect.start),
        yStep * (timelinePosition - appearanceStart - effect.start)));
    } else if (effect.type === SHAPE_RESIZE) {
      const scaleStep = scale / effect.duration;
      path.scale(scaleStep * (timelinePosition - appearanceStart - effect.start));
    } else if (effect.type === SHAPE_ROTATE) {
      const shapeRotate = effect as ShapeRotateEffect;
      const degreeStep = shapeRotate.degrees / effect.duration;
      path.rotate(degreeStep * (timelinePosition - appearanceStart - effect.start));
    }
  }
}
