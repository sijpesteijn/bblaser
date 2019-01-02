import * as paper from 'paper';
import { HIT_OPTIONS, PaperService, Tool } from '../paper.service';

export class SelectTool implements Tool {
  private tool: paper.Tool;
  private hit: paper.HitResult;
  private moving = false;
  private snap = false;

  constructor(private paperService: PaperService) {
    this.tool = new paper.Tool();
    this.tool.onMouseDown = (event: paper.ToolEvent) => {
      const hit: paper.HitResult = paper.project.activeLayer.hitTest(event.downPoint);
      if (hit && hit.item.data.type !== 'grid') {
        if (!hit.item.selected) {
          // console.log('Select ', event);
          this.hit = hit;
          this.hit.item.selected = true;
        } else {
          console.log('Doit ', hit);
          this.hit = hit;
          this.moving = true;
        }
      }
    };
    this.tool.onMouseMove = (event: paper.ToolEvent) => {
      event.stopPropagation();
      if (this.moving) {
        if (this.snap) {
          const hit: paper.HitResult = paper.project.layers[0].hitTest(event.lastPoint, HIT_OPTIONS);
          if (hit && hit.item.data.type === 'grid') {
            console.log('Hit ', hit);
            if (this.hit.type === 'segment') {
              this.hit.segment.point = hit.point;
            } else if (this.hit.type === 'stroke') {
              (this.hit.item as paper.Path).position = hit.point;
            }
          }
        } else {
          console.log('Hit ', this.hit);
          if (this.hit.type === 'segment') {
            this.hit.segment.point = event.lastPoint;
          } else if (this.hit.type === 'stroke') {
            (this.hit.item as paper.Path).position = event.lastPoint;
          }
        }
      }
    };

    this.tool.onMouseUp = (event: paper.ToolEvent) => {
      this.moving = false;
    };
  }

  activate() {
    this.tool.activate();
    console.log('select tool activated.');
  }

  remove() {
    this.tool.remove();
    this.tool = undefined;
  }

  snapToGrid(checked: boolean): void {
    this.snap = checked;
  }

}
