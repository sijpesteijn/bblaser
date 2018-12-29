import { Injectable } from '@angular/core';
import * as paper from 'paper';
import {
  BBAnimation,
  BBBox,
  BBColor,
  BBElement,
  BBLine,
  BBPoint,
  BBShape
} from '../animations/animation.service';
import { EventService } from '../event.service';
import { Store } from '@ngrx/store';
import * as paperStore from './';
import { BoxTool, LineTool, SelectTool, STROKE_WIDTH } from './tools';
import { MoveTool } from './tools/move.tool';
import { EffectService } from '../timeline-effects/effect.service';

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
  private tools: { name: string; tool: Tool; }[] = [];
  private gridLayer: paper.Layer;

  constructor(private eventService: EventService,
              private effectService: EffectService,
              private pStore: Store<paperStore.PaperState>) {
    paper.install(window);
    this.tools.push({name: 'selectTool', tool: new SelectTool(this)});
    this.tools.push({name: 'boxTool', tool: new BoxTool(this)});
    this.tools.push({name: 'lineTool', tool: new LineTool(this)});
    this.tools.push({name: 'moveTool', tool: new MoveTool(this)});
  }

  setup(identifier: string) {
    console.log('Initializing paper for: ', identifier);
    paper.setup(identifier);
    paper.project.currentStyle.strokeWidth = STROKE_WIDTH;
    paper.project.currentStyle.fontSize = 25;
    paper.settings.handleSize = 8;
    this.calculateScale();
    this.createGridLayer();
  }

  setZoom(zoom: number) {
    paper.view.zoom = zoom;
    this.calculateScale();
  }

  setTool(tool: string) {
    if (tool) {
      this.activeTool = this.tools.find(t => t.name === tool).tool;
      this.activeTool.activate();
    }
  }

  private calculateScale() {
    this.scale = paper.view.viewSize.width / 65534 / paper.view.zoom;
  }

  createGridLayer(): void {
    this.gridLayer = paper.project.activeLayer;
    const gridLevel = 25;
    const side = (((65534 * this.scale) % gridLevel) / 2) - 2;
    this.lineGrid(side, gridLevel, true);
  }

  private lineGrid(side, gridLevel: number, dotted: boolean) {
    const dashArray = [2, gridLevel];
    for (let i = 0; i < ((65534 * this.scale) - side); i++) {
      if (i % gridLevel === 0) {
        const line = new paper.Path.Line(new paper.Point(i + side, 0), new paper.Point(i + side, (65534 * this.scale)));
        line.strokeColor = '#bbbbbb';
        line.strokeWidth = 1;
        if (dotted) {
          line.dashArray = dashArray;
        }
      }
    }
    if (!dotted) {
      for (let i = 0; i < ((65534 * this.scale) - side); i++) {
        if (i % gridLevel === 0) {
          const line = new paper.Path.Line(new paper.Point(0, i + side), new paper.Point((65534 * this.scale), i + side));
          line.strokeColor = '#bbbbbb';
          line.strokeWidth = 1;
        }
      }
    }
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
      visible: path.visible,
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
      visible: path.visible,
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
      // paper.project.clear();
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
    path.visible = element.shape.visible;
    element.appearances
      .filter(app => app.start <= position && position < app.start + app.duration)
      .forEach(app => {
        app.effects.filter(effect => app.start + effect.start <= position && position < app.start + effect.start + effect.duration)
          .forEach(effect => {
            this.effectService.manipulatePath(path, effect, app.start, position, this.scale);
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
        if (paperObject.visible) {
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
            visible: paperObject.visible,
            color: {red: strokeColor[0], green: strokeColor[1], blue: strokeColor[2]},
            points: points
          });
        }
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

  showGrid(visible: boolean) {
    this.gridLayer.visible = visible;
  }
}
