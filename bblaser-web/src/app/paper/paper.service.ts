import { Injectable } from '@angular/core';
import * as paper from 'paper';
import * as onecolor from 'onecolor';
import {
  BBAnimation,
  BBBox,
  BBColor,
  BBColorGradientEffect,
  BBElement,
  BBLine,
  BBMoveEffect,
  BBPoint,
  BBResizeEffect,
  BBRotateEffect,
  BBShape
} from '../animations/animation.service';
import { EventService } from '../event.service';
import { Store } from '@ngrx/store';
import * as paperStore from './';
import { BoxTool, LineTool, SelectTool, STROKE_WIDTH } from './tools';
import { MoveTool } from './tools/move.tool';

export interface Tool {
  activate();

  remove();
}

@Injectable({
  providedIn: 'root'
})
export class PaperService {
  public scale = 1;
  public activeTool: Tool;
  private animation: BBAnimation;

  constructor(private eventService: EventService,
              private pStore: Store<paperStore.PaperState>) {
    paper.install(window);
  }

  setup(identifier: string) {
    console.log('Initializing paper for: ', identifier);
    paper.setup(identifier);
    paper.project.currentStyle.strokeWidth = STROKE_WIDTH;
    paper.project.currentStyle.fontSize = 25;
    paper.settings.handleSize = 8;
    this.calculateScale();
  }

  setZoom(zoom: number) {
    paper.view.zoom = zoom;
    this.calculateScale();
  }

  setTool(tool: string) {
    if (this.activeTool) {
      this.activeTool.remove();
      this.activeTool = undefined;
    }
    if (tool) {
      if (tool === 'selectTool') {
        this.activeTool = new SelectTool(this);
      } else if (tool === 'boxTool') {
        this.activeTool = new BoxTool(this);
      } else if (tool === 'lineTool') {
        this.activeTool = new LineTool(this);
      } else if (tool === 'moveTool') {
        this.activeTool = new MoveTool(this);
      }
      this.activeTool.activate();
    }
  }

  private calculateScale() {
    this.scale = paper.view.viewSize.width / 65534 / paper.view.zoom;
  }

  createPath(points: BBPoint[], strokeColor: BBColor): paper.Path {
    const path = new paper.Path();
    path.strokeColor = new paper.Color(strokeColor.red, strokeColor.green, strokeColor.blue);
    points.forEach(point => path.add(new paper.Point(point.x, point.y)));
    path.visible = false;
    return path;
  }

  setAnimation(animation: BBAnimation) {
    this.clear();
    this.animation = animation;
  }

  isSomethingSelected(path: paper.Path) {
    let something = false;
    if (path) {
      if (path.fullySelected) {
        something = true;
      } else {
        something = Array.from(path.segments).filter((segment: paper.Segment) => segment.selected).length > 0 ? true : false;
      }
    }
    return something;

  }

  createNewShape(path: paper.Path) {
    if (!path.closed) {
      this.pStore.dispatch(new paperStore.ShapeCreatedAction(this.getBBLine(path)));
    } else if (path.closed) {
      this.pStore.dispatch(new paperStore.ShapeCreatedAction(this.getBBBox(path)));
    }
  }

  moveShape(rectangle: paper.Path.Rectangle, diff: any) {

  }

  getDiff(startPoint: paper.Point, point: any) {

  }

  updateShape(path: paper.Path) {
    this.pStore.dispatch(new paperStore.ShapeUpdatedAction(this.getBBLine(path)));
  }

  getBBLine(path: paper.Path): BBLine {
    const points: BBPoint[] = [];
    path.segments.forEach(seg => points.push({x: seg.point.x / this.scale, y: seg.point.y / this.scale}));
    return {
      id: path.id,
      type: 'line',
      color: {
        red: (path.strokeColor as paper.Color).red,
        green: (path.strokeColor as paper.Color).green,
        blue: (path.strokeColor as paper.Color).blue
      },
      points: points
    };
  }

  getBBBox(path: paper.Path): BBBox {
    const points: BBPoint[] = [];
    path.segments.forEach(seg => points.push({x: seg.point.x / this.scale, y: seg.point.y / this.scale}));
    return {
      id: path.id,
      type: 'box',
      color: {
        red: (path.strokeColor as paper.Color).red,
        green: (path.strokeColor as paper.Color).green,
        blue: (path.strokeColor as paper.Color).blue
      },
      points: points
    };
  }

  clear() {
    if (paper.project) {
      paper.project.clear();
    }
  }

  private drawShapeWithEffects(element: BBElement, position: number) {
    const path = this.createPath(element.shape.points.map(point => {
      return {x: point.x * this.scale, y: point.y * this.scale};
    }), {
      red: element.shape.color.red,
      green: element.shape.color.green,
      blue: element.shape.color.blue
    });
    path.data = {
      id: element.id,
      name: element.name,
      type: element.shape.type
    };
    if (element.shape.type === 'box') {
      path.closed = true;
      path.data.closed = true;
    }
    path.visible = true;
    element.appearances
      .filter(app => app.start <= position && position < app.start + app.duration)
      .forEach(app => {
        app.effects.filter(effect => app.start + effect.start <= position && position < app.start + effect.start + effect.duration)
          .forEach(effect => {
            switch (effect.type) {
              case 'color_gradient': {
                const colorGradient = (effect as BBColorGradientEffect);
                const startColor = onecolor('rgb(' + colorGradient.startColor.red + ',' + colorGradient.startColor.green
                  + ',' + colorGradient.startColor.blue + ')');
                const endColor = onecolor('rgb(' + colorGradient.endColor.red + ',' + colorGradient.endColor.green
                  + ',' + colorGradient.endColor.blue + ')');
                const rDelta = (endColor.red() - startColor.red()) / (effect.duration + 1);
                const gDelta = (endColor.green() - startColor.green()) / (effect.duration + 1);
                const bDelta = (endColor.blue() - startColor.blue()) / (effect.duration + 1);
                const aDelta = (endColor.alpha() - startColor.alpha()) / (effect.duration + 1);
                const uColor = startColor
                  .red(rDelta * (position - app.start - effect.start), true)
                  .green(gDelta * (position - app.start - effect.start), true)
                  .blue(bDelta * (position - app.start - effect.start), true)
                  .alpha(aDelta * (position - app.start - effect.start), true).hex();
                path.strokeColor = uColor;
              }
                break;
              case 'shape_move': {
                const shapeMove = (effect as BBMoveEffect);
                const xStep = Math.abs(shapeMove.startPosition.x - shapeMove.endPosition.x) * this.scale / shapeMove.duration;
                const yStep = Math.abs(shapeMove.startPosition.y - shapeMove.endPosition.y) * this.scale / shapeMove.duration;
                path.translate(new paper.Point(xStep * (position - app.start - effect.start), yStep * (position - app.start - effect.start)));
              }
                break;
              case 'shape_rotate': {
                const shapRotate = (effect as BBRotateEffect);
                const degreeStep = shapRotate.degrees / shapRotate.duration;
                path.rotate(degreeStep * (position - app.start - effect.start));
              }
                break;
              case 'shape_resize': {
                const shapeResize = (effect as BBResizeEffect);
                const scaleStep = shapeResize.scale / shapeResize.duration;
                path.scale(scaleStep * (position - app.start - effect.start));
              }
                break;
            }
          });

      });
  }

  showCurrentPosition(position: number): BBShape[] {
    this.clear();
    if (this.animation) {
      this.animation.elements
        .filter(element => element.appearances
          .filter(app => app.start <= position && position < app.start + app.duration).length > 0)
        .forEach(element => this.drawShapeWithEffects(element, position));
      const bbShapes: BBShape[] = this.getBBShapes(JSON.parse(paper.project.activeLayer.exportJSON())[1].children);
      return bbShapes;
    }
    return [];
  }

  getBBShapes(paperObjects: paper.Shape[]): BBShape[] {
    const bbShapes: BBShape[] = [];
    if (paperObjects) {
      paperObjects.map(paperObject => paperObject[1]).forEach(paperObject => {
        const points: BBPoint[] = [];
        paperObject.segments.forEach(segment => points.push(
          {
            x: Math.round(segment[0] / this.scale),
            y: Math.round(segment[1] / this.scale)
          }));
        const strokeColor = paperObject.strokeColor;
        bbShapes.push({
          id: 0,
          type: paperObject.data.type,
          color: {red: strokeColor[0], green: strokeColor[1], blue: strokeColor[2]},
          points: points
        });
      });
    }
    return bbShapes;
  }

  getDuration(): number {
    const longest = this.animation.elements.sort((e1, e2) => {
      const eA1 = e1.appearances.sort((a1, a2) => (a1.start + a1.duration) - (a2.start + a2.duration))[0];
      const eA2 = e2.appearances.sort((a1, a2) => (a1.start + a1.duration) - (a2.start + a2.duration))[0];
      return (eA2.start + eA2.duration) - (eA1.start + eA1.duration);
    })[0];
    if (longest) {
      const longestAppearance = longest.appearances.sort((a1, a2) => (a1.start + a1.duration) - (a2.start + a2.duration))[0];
      return longestAppearance.start + longestAppearance.duration;
    }
    return 0;
  }

}
