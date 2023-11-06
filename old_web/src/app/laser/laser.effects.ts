import { Injectable } from '@angular/core';
import { EndpointsService } from '../endpoints.service';
import { defer, of } from 'rxjs';
import { Effect } from '@ngrx/effects';
import { LaserEndpointAction } from './laser.action';

@Injectable()
export class LaserEffects {

  constructor(private endpointService: EndpointsService) {
  }

  @Effect()
  initialize$ = () => defer(() => of(new LaserEndpointAction(this.endpointService.get('lifeline'))))
}
