import * as paper from 'paper';
import { PaperService, Tool } from '../paper.service';
import { STROKE_WIDTH } from './tools';

export class BoxTool implements Tool {
  private tool: paper.Tool;
  private startPoint: paper.Point;
  private rectangle: paper.Path.Rectangle;
  private color = new paper.Color(255, 255, 255);
  private drawing = false;

  constructor(private paperService: PaperService) {
    this.tool = new paper.Tool();
    this.tool.onMouseDown = (event: paper.ToolEvent) => {
      if (this.drawing === false) {
        const point = this.paperService.getGridHit(event.downPoint).point;
        this.startPoint = new paper.Point(point.x, point.y);
        if (!paperService.isSomethingSelected(this.rectangle)) {
          const bottomRight = new paper.Point(point.x + 10, point.y + 10);
          this.rectangle = new paper.Path.Rectangle(this.startPoint, bottomRight);
          this.rectangle.name = 'Rectangle_' + this.rectangle.index;
          this.rectangle.strokeColor = this.color;
          this.rectangle.strokeWidth = STROKE_WIDTH;
          this.rectangle.dashArray = [5, 5];
          this.drawing = true;
        }
      }
    };
    this.tool.onMouseMove = (event: paper.ToolEvent) => {
      if (paperService.isSomethingSelected(this.rectangle)) {
        if (this.startPoint) {
          paperService.moveShape(this.rectangle, paperService.getDiff(this.startPoint, event.downPoint));
        }
      } else if (this.drawing === true) {
        const point = this.paperService.getGridHit(event.lastPoint).point;
        this.rectangle.segments[0].point.y = point.y;
        this.rectangle.segments[2].point.x = point.x;
        this.rectangle.segments[3].point = point;
        paper.view.draw();
      }
    };
    this.tool.onMouseUp = (event: paper.ToolEvent) => {
      if (this.drawing) {
        this.rectangle.dashArray = undefined;
        // addToHistory(rectangle);
        this.drawing = false;
        // paper.view.draw();
        this.paperService.createNewShape(this.rectangle);
        // objectListener(rectangle);
        this.startPoint = null;
      }
    };
  }

  activate() {
    this.tool.activate();
    console.log('box tool activated.');
  }

  remove() {
    this.tool.remove();
    this.tool = undefined;
  }
}
