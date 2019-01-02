import * as paper from 'paper';
import { STROKE_WIDTH } from './tools';
import { PaperService, Tool } from '../paper.service';

export class LineTool implements Tool {
  private tool: paper.Tool;
  private drawing = false;
  private path: paper.Path;
  private line: paper.Path;
  private nextPoint: paper.Point;
  private color = new paper.Color(255, 255, 255);
  private selectStart: any;

  constructor(private paperService: PaperService) {
    this.tool = new paper.Tool();
    this.tool.onMouseDown = (event: paper.ToolEvent) => {
      if ((event as any).event.button === 0) {
        if (paperService.isSomethingSelected(this.path)) {
          this.selectStart = event.downPoint;
        } else {
          const point = new paper.Point(event.downPoint.x, event.downPoint.y);
          if (this.drawing === false) {
            this.path = new paper.Path();
            this.path.selectedColor = 'red';
            this.path.name = 'Path_' + this.path.index;
            (this.path as any).type = 'Path';
            this.path.strokeColor = this.color;
            this.path.strokeWidth = STROKE_WIDTH;
            // this.addToHistory(this.path);
            this.path.add(point);
            (this.path.segments[this.path.segments.length - 1].point as any).name = 'Point_' + (this.path.segments.length - 1);
            // this.addToHistory(this.path, point);
            this.drawHelperLine(event);
            this.drawing = true;
          } else {
            this.path.add(point);
            (this.path.segments[this.path.segments.length - 1].point as any).name = 'Point_' + (this.path.segments.length - 1);
            if (this.path.segments.length === 2) {
              this.paperService.createNewShape(this.path);
            }
            // this.addToHistory(this.path, point);
            this.drawHelperLine(event);
          }
        }
      } else if ((event as any).event.button === 2) {
        // event.preventDefault();
        this.line.remove();
        this.drawing = false;
        if (this.path.segments.length === 1) {
          this.path.remove();
        } else {
          this.paperService.updateShape(this.path);
        }
      }
    };
    this.tool.onMouseMove = (event: paper.ToolEvent) => {
      if (!this.paperService.isSomethingSelected(this.path) && this.drawing === true) {
        this.line.segments[1].point = event.point;
      }
    };
    this.tool.onMouseUp = this.mouseUp;
    this.tool.onMouseDrag = this.mouseDrag;
    this.tool.onKeyDown = this.keyDown;
  }

  public activate() {
    this.tool.activate();
    console.log('line tool activated.');
  }

  private mouseMove(event: any) {

  }

  private mouseUp(event: any) {
    this.drawing = false;
  }

  private mouseDrag(event: any) {

  }

  private keyDown(event: any) {

  }

  private drawHelperLine(event: paper.ToolEvent) {
    if (this.line) {
      this.line.remove();
    }
    this.nextPoint = new paper.Point(event.downPoint.x + 1, event.downPoint.y);
    (this.nextPoint as any).name = 'Point';
    this.line = new paper.Path.Line(new paper.Point(event.downPoint.x, event.downPoint.y), this.nextPoint);
    this.line.strokeColor = this.color;
    this.line.strokeWidth = STROKE_WIDTH;
    this.line.dashArray = [5, 5];
  }

  private addToHistory(parent: any, item?: any) {

  }

  remove() {
    this.tool.remove();
    this.tool = undefined;
  }

  snapToGrid(checked: boolean): void {
  }
}
