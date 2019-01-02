import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AnimationService } from '../animation.service';
import * as animationActions from './animation.actions';
import { catchError, debounceTime, map, mergeMap, switchMap, tap } from 'rxjs/internal/operators';
import { of } from 'rxjs/index';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { PaperService } from '../../paper/paper.service';

@Injectable()
export class AnimationEffects {

  constructor(private router: Router,
              private actions$: Actions,
              private animationService: AnimationService,
              private paperService: PaperService) {
  }

  @Effect()
  selectAnimation$ = this.actions$.pipe(
    ofType(animationActions.SELECT_ANIMATION),
    switchMap((action: animationActions.SelectAnimationAction) => {
      return of(new animationActions.LoadAnimationSuccessAction(action.animation));
    })
  );

  @Effect()
  loadAnimation$ = this.actions$.pipe(
    ofType(animationActions.LOAD_ANIMATION),
    switchMap((action: animationActions.LoadAnimationAction) => {
      return this.animationService.get(action.animationId).pipe(
        map(animation => new animationActions.LoadAnimationSuccessAction(animation)),
        catchError(err => of(new animationActions.LoadAnimationFailAction(err)))
      );
    })
  );

  @Effect()
  saveAnimation$ = this.actions$.pipe(
    ofType(animationActions.SAVE_ANIMATION),
    debounceTime(500),
    switchMap((action: animationActions.SaveAnimationAction) => {
      action.animation.last_update = moment().valueOf();
      return this.animationService.save(action.animation).pipe(
        tap(animation => {
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
  sendToLaser$ = this.actions$.pipe(
    ofType(animationActions.SEND_TO_LASER),
    switchMap((action: animationActions.SendToLaser) => {
      return this.animationService.sendToLaser(action.bbShapes).pipe(
        // tap(  console.log),
        // map(result => result),
        // map(result => new)
        catchError(err => of(err))
      );
    })
  );

  @Effect({dispatch: false})
  setTool$ = this.actions$.pipe(
    ofType(animationActions.SELECT_DRAW_TOOL),
    tap((action: animationActions.SelectDrawToolAction) => {
      this.paperService.setTool(action.tool);
    })
  )

}
