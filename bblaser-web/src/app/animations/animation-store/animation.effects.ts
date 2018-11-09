import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AnimationService } from '../animation.service';
import * as animationActions from './animation.actions';
import { catchError, debounceTime, map, switchMap, tap } from 'rxjs/internal/operators';
import { of } from 'rxjs/index';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Injectable()
export class AnimationEffects {

  constructor(private router: Router,
              private actions$: Actions,
              private animationService: AnimationService) {
  }

  @Effect()
  selectAnimation$ = this.actions$.ofType(animationActions.SELECT_ANIMATION).pipe(
    switchMap((action: animationActions.SelectAnimationAction) => {
      return of(new animationActions.LoadAnimationSuccessAction(action.animation));
    })
  );

  @Effect()
  loadAnimation$ = this.actions$.ofType(animationActions.LOAD_ANIMATION).pipe(
    switchMap((action: animationActions.LoadAnimationAction) => {
      return this.animationService.get(action.animationId).pipe(
        map(animation => new animationActions.LoadAnimationSuccessAction(animation)),
        catchError(err => of(new animationActions.LoadAnimationFailAction(err)))
      );
    })
  );

  @Effect()
  saveAnimation$ = this.actions$.ofType(animationActions.SAVE_ANIMATION).pipe(
    debounceTime(500),
    switchMap((action: animationActions.SaveAnimationAction) => {
      action.animation.last_update = moment().valueOf();
      return this.animationService.save(action.animation).pipe(
        tap(animation => {
          console.log('Saving animation over http');
          if (action.open) {
            this.router.navigate(['/animations/' + animation.id]);
          }
        }),
        map(animation => new animationActions.SaveAnimationSuccessAction(animation)),
        catchError(err => of(new animationActions.SaveAnimationFailAction(err)))
      );
    })
  );

  @Effect({ dispatch: false})
  sendToLaser$ = this.actions$.ofType(animationActions.SEND_TO_LASER).pipe(
    switchMap((action: animationActions.SendToLaser) => {
      return this.animationService.sendToLaser(action.bbShapes).pipe(
        // tap(  console.log),
        // map(result => result),
        // map(result => new)
        catchError(err => of(err))
      );
    })
  );

}
