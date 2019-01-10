import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component';
import { Store } from '@ngrx/store';
import * as laserStore from '../laser';

@Component({
  selector: 'bb-header',
  template: `
    <div class="header-container">
      <div class="header-links">
        <button routerLink="/animations">Animations</button>
        <button routerLink="/sequences">Sequences</button>
        <button routerLink="/shows">Shows</button>
        <button (click)="openSettings()">Settings</button>
      </div>
      <div class="laser-indication">
        <span>Laser:</span>
        <span *ngIf="connected" class="blink_me" alt="Laser is connected"></span>
        <span *ngIf="!connected" class="not_connected">X</span>
      </div>
    </div>`,
  styles: [`
    .header-container {
      /*position: relative;*/
      /*overflow: hidden;*/
      display: flex;
      justify-content: space-between;
    }

    .header-links {
      /*float: left;*/
    }

    .laser-indication {
      color: white;
      top: 3px;
      margin-right: 20px;
      /*float: right;*/
    }

    .laser-indication .blink_me {
      animation: blinker 1s linear infinite;
      width: 13px;
      height: 13px;
      border-radius: 20px;
      background-color: green;
      position: absolute;
    }

    @keyframes blinker {
      50% {
        opacity: 0;
      }
    }

    .laser-indication .not_connected {
      color: red;
    }
  `]
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  private lifeline: WebSocket;
  private retry: any;
  heartbeat = false;
  connected = false;
  dialogRef;

  constructor(public dialog: MatDialog, private store: Store<laserStore.LaserState>) {
  }

  ngAfterViewInit() {
    this.store.select(laserStore.laserAddress).subscribe(address => {if (address) { this.startReconnect(address);}});
  }

  ngOnDestroy() {
    clearInterval(this.retry);
  }

  startReconnect(address: string) {
    console.log('Address ', address);
    this.retry = setInterval(() => {
      try {
        this.lifeline = new WebSocket(address);
        clearInterval(this.retry);
        this.lifeline.onopen = () => {
          this.connected = true;
        };
        this.lifeline.onmessage = () => {
          this.store.dispatch(new laserStore.LaserConnectionAction(true));
          this.heartbeat = !this.heartbeat;
          setTimeout(() => this.lifeline.send('ping'), 10000);
        };
        this.lifeline.onerror = () => {
          this.connected = false;
          this.store.dispatch(new laserStore.LaserConnectionAction(false));
        };
        this.lifeline.onclose = () => {
          this.connected = false;
          this.store.dispatch(new laserStore.LaserConnectionAction(false));
          this.startReconnect(address);
        };
      } catch (error) {
        console.error(error);
      }

    }, 1000);
  }

  openSettings() {
    this.dialogRef = this.dialog.open(SettingsDialogComponent, {
      data: 'settings'
    });

  }
}
