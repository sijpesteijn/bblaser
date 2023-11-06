import { Action } from '@ngrx/store';

export const LASER_CONNECTION = '[Laser] LaserConnectionAction';
export const LASER_ENDPOINT = '[Laser] LaserEndpointAction';

export class LaserConnectionAction implements Action {
  readonly type = LASER_CONNECTION;
  constructor(public connected: boolean) {}
}

export class LaserEndpointAction implements Action {
  readonly type = LASER_ENDPOINT;
  constructor(public endpoint: string) {}
}

export type BBLaserActions = LaserConnectionAction | LaserEndpointAction;
