import { Component, OnDestroy, OnInit } from '@angular/core';
import { PaperService } from '../../paper/paper.service';
import * as animationStore from '../animation-store';
import * as paperStore from '../../paper';
import * as laserStore from '../../laser';
import { Store } from '@ngrx/store';
import { BBAnimation } from '../animation.service';
import { TIMEOUT_TIME } from '../../timeline/timeline.component';

@Component({
  selector: 'bb-animation-canvas',
  template: `
    <div class="animation_container" oncontextmenu="return false;">
      <canvas id="animation" resize="true" keepalive="true"></canvas>
    </div>`,
  styles: [`
    .animation_container {
      position: relative;
      width: 50vw;
      border: 1px solid red;
    }

    .animation_container:after {
      content: "";
      display: block;
      padding-bottom: 100%;
    }

    canvas {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: black;
    }
  `]
})
export class AnimationCanvasComponent implements OnInit, OnDestroy {
  private animation: BBAnimation;
  private previewing = false;
  private startTime: number;
  private intervalPosition = 0;
  private maxPosition = 0;
  private previewHandle: any;

  constructor(private paperService: PaperService,
              private aStore: Store<animationStore.AnimationState>,
              private lStore: Store<laserStore.LaserState>) {
  }

  ngOnInit() {
    this.paperService.setup('animation');
    this.aStore.select(animationStore.selectedTool).subscribe(tool => {
      console.log('Selector found tool ', tool);
      this.paperService.setTool(tool);
    });
    this.aStore.select(animationStore.selectSelectedAnimation).subscribe(animation => {
      if (animation) {
        if (this.animation === undefined || this.animation.id !== animation.id) {
          this.animation = animation;
          this.paperService.setAnimation(this.animation);
          this.aStore.dispatch(new paperStore.AnimationLoadedAction(this.animation));
        }
      } else {
        this.stopPreview();
        this.animation = undefined;
        this.paperService.clear();
      }
    });
    this.aStore.select(animationStore.selectTimerPosition)
      .subscribe(position => {
        this.lStore.select(laserStore.laserConnected).subscribe(connected => {
          console.log('Position ', connected);
          if (connected) {
            const bbShapes = this.paperService.showCurrentPosition(position);
            this.aStore.dispatch(new animationStore.SendToLaser(bbShapes));
          }
        });
      });
    this.aStore.select(animationStore.previewAnimation)
      .subscribe(animation => {
        this.stopPreview();
        this.paperService.setAnimation(animation);
        if (animation) {
          this.startPreview();
        } else {
          this.stopPreview();
        }
      });
  }

  ngOnDestroy() {
    console.log('Canvas destroyed');
    this.stopPreview();
    this.paperService.clear();
    this.aStore.complete();
  }

  private stopPreview() {
    clearInterval(this.previewHandle);
    this.lStore.select(laserStore.laserConnected).subscribe(connected => {
      console.log('Stop ', connected);
      if (connected) {
        this.aStore.dispatch(new animationStore.SendToLaser([]));
      }
    });
    this.previewing = false;
    this.intervalPosition = 0;
    this.maxPosition = 0;
  }

  private previewPosition() {
    if (this.previewing) {
      const current = new Date().getTime();
      const diff = TIMEOUT_TIME - (current - this.startTime);
      if (this.intervalPosition + TIMEOUT_TIME < this.maxPosition) {
        this.intervalPosition += TIMEOUT_TIME;
      } else {
        this.intervalPosition = 0;
      }
      this.aStore.dispatch(new animationStore.SetTimerPosition(this.intervalPosition));
      this.startTime = current;
      this.previewHandle = setTimeout(() => this.previewPosition(), TIMEOUT_TIME + diff);
    }
  }

  private startPreview() {
    this.maxPosition = this.paperService.getDuration();
    this.startTime = new Date().getTime();
    this.previewing = true;
    setTimeout(() => this.previewPosition(), TIMEOUT_TIME);
  }
}
