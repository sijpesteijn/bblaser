import { Action } from '@ngrx/store';

export const LASER_CONNECTION = '[Laser] LaserConnectionAction';

export class LaserConnectionAction implements Action {
  readonly type = LASER_CONNECTION;
  constructor(public connected: boolean) {}
}

export type BBLaserActions = LaserConnectionAction;
