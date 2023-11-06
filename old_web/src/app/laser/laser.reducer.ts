import * as fromBBLaser from './laser.action';

export interface LaserState {
  connected: boolean;
  address: string;
}

export const initialLaserState: LaserState = {
  connected: false,
  address: undefined // ws://localhost:1984/lifeline'
};

export function laserReducer(state = initialLaserState, action: fromBBLaser.BBLaserActions): LaserState {
  switch (action.type) {
    case fromBBLaser.LASER_CONNECTION: {
      return {
        ...state,
        connected: action.connected
      };
    }
    case fromBBLaser.LASER_ENDPOINT: {
      return {
        ...state,
        address: action.endpoint
      };
    }
  }
  return state;
}
