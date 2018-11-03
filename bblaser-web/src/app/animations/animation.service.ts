import { Injectable } from '@angular/core';
import {
  ANIMATION_ALL, ANIMATION_BYID, ANIMATION_REMOVE, ANIMATION_SAVE,
  EndpointsService, LASER
} from '../endpoints.service';
import { BehaviorSubject, Subject, Observable } from 'rxjs/index';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/internal/operators';
import { RequestOptions } from '@angular/http';

export interface GetAnimationOptions {
  page: number;
  pageSize: number;
  sort: string;
  direction: string;
}

export interface BBPoint {
  x: number;
  y: number;
}

export interface BBColor {
  red: number;
  blue: number;
  green: number;
}

export interface BBLine extends BBShape {
}

export interface BBBox extends BBShape {
}

export interface BBShape {
  id: number;
  type: string;
  points: BBPoint[];
  color: BBColor;
}

export interface BBColorEffect extends BBEffect {
  startColor: BBColor;
  endColor: BBColor;
}

export interface BBMoveEffect extends BBEffect {
  startPosition: BBPoint;
  endPosition: BBPoint;
}

export interface BBRotateEffect extends BBEffect {
  degrees: number;
}

export interface BBResizeEffect extends BBEffect {
  scale: number;
}

export interface BBEffect {
  id: number;
  type: string;
  name: string;
  start: number;
  duration: number;
}

export interface BBAppearance {
  id: number;
  start: number;
  duration: number;
  effects?: BBEffect[];
}

export interface BBElement {
  id: number;
  name: string;
  shape: BBShape;
  appearances: BBAppearance[];
}

export class BBAnimation {
  id?: number;
  title: string;
  last_update: number;
  elements: BBElement[];
}

export interface AnimationPagedCollection extends PagedCollection {
  content: BBAnimation[];
}
export interface PagedCollection {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  number: number;
  size: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
  },
  numberOfElements: number;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
    sort: {
      sorted: boolean;
      unsorted: boolean;
    }
  };
}

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private animation: Subject<BBAnimation>;

  constructor(private endpoints: EndpointsService,
              private httpClient: HttpClient) {
    this.animation = new BehaviorSubject(undefined);
  }

  all(options: Partial<GetAnimationOptions>): Observable<AnimationPagedCollection> {
    const params = new HttpParams()
      .set('page', options.page.toString())
      .set('pageSize', options.pageSize.toString())
      .set('sort', options.sort)
      .set('direction', options.direction);
    return this.httpClient.get<AnimationPagedCollection>(this.endpoints.get(ANIMATION_ALL), { params: params })
      .pipe(catchError(err => Observable.throw(err.json())));
  }

  get(id: string): Observable<BBAnimation> {
    return this.httpClient.get<BBAnimation>(this.endpoints.get(ANIMATION_BYID).replace(':id', id))
      .pipe(map((response) => {
        this.animation.next(response);
        return response;
    }));
  }

  save(animation: BBAnimation): Observable<BBAnimation> {
    return this.httpClient.post<BBAnimation>(this.endpoints.get(ANIMATION_SAVE), animation).pipe(map((response) => {
      this.animation.next(response);
      return response;
    }));
  }

  getAnimationSubject(): Observable<BBAnimation> {
    return this.animation.asObservable();
  }

  remove(animation: BBAnimation): Observable<any> {
    return this.httpClient.delete(this.endpoints.get(ANIMATION_REMOVE).replace(':id', animation.id.toString()));
  }

  sendToLaser(shapes: BBShape[]) {
    const stripped = shapes.map(shape => {
      if (shape.type === 'box') {
        shape.points.push({...shape.points[0]});
      }
      delete shape['id'];
      delete shape['type'];
      console.log('shape ', shape);
      return shape.color.red.toString(16) + shape.color.green.toString(16) + shape.color.blue.toString(16)
        + shape.points.map(point => point.x.toString(16) + point.y.toString(16))
          .reduce((previousValue, currentValue) => previousValue + currentValue);
    });
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type':  'text/plain'
    //   })
    // };
    return this.httpClient.post<any>(this.endpoints.get(LASER), {shapes: stripped}).pipe(
      map(result => result)
    );
  }
}
