
import { BBState } from './bblaser.reducers';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const bblaserState = createFeatureSelector<BBState>('bblaser');
