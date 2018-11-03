import { Injectable } from '@angular/core';


export const ANIMATION_ALL = 'animations.all';
export const ANIMATION_REMOVE = 'animations.remove';
export const ANIMATION_BYID = 'animations.byId';
export const ANIMATION_UPLOAD = 'animations.upload';
export const ANIMATION_SAVE = 'animations.save';
export const ANIMATION_FRAME_UPDATE = 'animations.frame_update';
export const LASER = 'laser';
export const LIFELINE = 'lifeline';

@Injectable({
  providedIn: 'root'
})
export class EndpointsService {
  endpoints: Map<string, string> = new Map();
  readonly BASE_URL = 'http://bb-laser.test/';

  constructor() {
    this.endpoints[ANIMATION_ALL] = this.BASE_URL + 'r/animations';
    this.endpoints[ANIMATION_REMOVE] = this.BASE_URL + 'r/animations/:id';
    this.endpoints[ANIMATION_BYID] = this.BASE_URL + 'r/animations/:id';
    this.endpoints[ANIMATION_UPLOAD] = this.BASE_URL + 'r/animations/upload';
    this.endpoints[ANIMATION_SAVE] = this.BASE_URL + 'r/animations/';
    this.endpoints[ANIMATION_FRAME_UPDATE] = this.BASE_URL + 'r/animations/:id/frame';
    this.endpoints[LASER] = this.BASE_URL + 'r/laser';
    this.endpoints[LIFELINE] = 'ws://localhost:1984/lifeline';
  }

  get(key: string): string {
    const endpoint = this.endpoints[key];
    if (!endpoint) {
      console.error('Could not find endpoint with ', key);
    }
    return endpoint;
  }
}
