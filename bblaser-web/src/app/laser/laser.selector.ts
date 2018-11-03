import { createSelector } from '@ngrx/store';
import { bblaserState } from '../store/bblaser.selectors';
import { BBState } from '../store/bblaser.reducers';
import { LaserState } from './laser.reducer';

export const laserState = createSelector(bblaserState, (state: BBState) => state.laser);
export const laserConnected = createSelector(laserState, (state: LaserState) => state.connected);
export const laserAddress = createSelector(laserState, (state: LaserState) => state.address);
