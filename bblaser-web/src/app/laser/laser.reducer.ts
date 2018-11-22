import * as fromBBLaser from './laser.action';

export interface LaserState {
  connected: boolean;
  address: string;
}

export const initialLaserState: LaserState = {
  connected: false,
  address: 'ws://192.168.88.41:1984/lifeline'
};

export function laserReducer(state = initialLaserState, action: fromBBLaser.LaserConnectionAction): LaserState {
  switch (action.type) {
    case fromBBLaser.LASER_CONNECTION: {
      return {
        ...state,
        connected: action.connected
      };
    }
  }
  return state;
}
