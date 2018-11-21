import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EffectItem } from '../../store';
import { ShapeRotateEffectComponent } from './shape-rotate-effect.compoent';
import { BBEffectData } from '../../../animations/animation.service';
import { ColorGradientEffectComponent } from './color-gradient-effect.compoent';
import { ShapeMoveEffectComponent } from './shape-move-effect.compoent';
import { ShapeResizeEffectComponent } from './shape-resize-effect.compoent';

@Injectable({
  providedIn: 'root'
})
export class EffectService {

  constructor() { }

  getEffect(effectData: BBEffectData): Observable<EffectItem> {
    if (effectData.type === 'color_gradient') {
      return of(new EffectItem(ColorGradientEffectComponent, effectData));
    } else if (effectData.type === 'shape_move') {
      return of(new EffectItem(ShapeMoveEffectComponent, effectData));
    } else if (effectData.type === 'shape_rotate') {
      return of(new EffectItem(ShapeRotateEffectComponent, effectData));
    } else if (effectData.type === 'shape_resize') {
      return of(new EffectItem(ShapeResizeEffectComponent, effectData));
    }
  }
}
