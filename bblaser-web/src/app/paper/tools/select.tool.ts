import * as paper from 'paper';
import { PaperService, Tool } from '../paper.service';

export class SelectTool implements Tool{
  private tool: paper.Tool;

  constructor(private paperService: PaperService) {
    this.tool = new paper.Tool();
    this.tool.onMouseDown = (event: paper.ToolEvent) => {
      const hit: paper.HitResult = paper.project.activeLayer.hitTest(event.downPoint);
      if (hit) {
        hit.item.previewAnimation = true;
      }
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
}
