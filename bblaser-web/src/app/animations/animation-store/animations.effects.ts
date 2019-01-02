import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AnimationPagedCollection, AnimationService } from '../animation.service';
import * as animationActions from './animations.actions';
import { catchError, map, switchMap } from 'rxjs/internal/operators';
import { of } from 'rxjs/index';

@Injectable()
export class AnimationsEffects {
  private animationPagedCollection: AnimationPagedCollection;

  constructor(private actions$: Actions,
              private animationService: AnimationService) {
  }

  @Effect()
  loadAnimations$ = this.actions$.pipe(
    ofType(animationActions.LOAD_ANIMATIONS),
    switchMap((action: animationActions.LoadAnimationsAction) => {
      return this.animationService.all(action.options).pipe(
        map(animationPagedCollection => {
          this.animationPagedCollection = animationPagedCollection;
          return new animationActions.LoadAnimationsSuccessAction(animationPagedCollection);
        }),
        catchError(err => of(new animationActions.LoadAnimationsFailAction(err)))
      );
    })
  );

  @Effect()
  removeAnimation$ = this.actions$.pipe(ofType(
    animationActions.REMOVE_ANIMATION),
    switchMap((action: animationActions.RemoveAnimationAction) => {
      return this.animationService.remove(action.payload).pipe(
        map(() => new animationActions.LoadAnimationsAction({
          page: 0,
          pageSize: action.options.pageSize,
          sort: action.options.sort,
          direction: action.options.direction
        })),
        catchError(err => of(new animationActions.RemoveAnimationFailAction(err)))
      );
    })
  );

  // @Effect()
  // initialize$ = () => defer(() => of(new LoadAnimationsAction()))

}
