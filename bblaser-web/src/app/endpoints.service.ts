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
  readonly PROTOCOL = 'http';
  readonly BASE_URL = '://bb-laser.test/';

  constructor() {
    this.endpoints[ANIMATION_ALL] = this.PROTOCOL + this.BASE_URL + 'r/animation';
    this.endpoints[ANIMATION_REMOVE] = this.PROTOCOL + this.BASE_URL + 'r/animation/:id';
    this.endpoints[ANIMATION_BYID] = this.PROTOCOL + this.BASE_URL + 'r/animation/:id';
    this.endpoints[ANIMATION_UPLOAD] = this.PROTOCOL + this.BASE_URL + 'r/animation/upload';
    this.endpoints[ANIMATION_SAVE] = this.PROTOCOL + this.BASE_URL + 'r/animation/';
    this.endpoints[ANIMATION_FRAME_UPDATE] = this.PROTOCOL + this.BASE_URL + 'r/animations/:id/frame';
    this.endpoints[LASER] = this.PROTOCOL + this.BASE_URL + 'r/laser';
    this.endpoints[LIFELINE] = 'ws' + this.BASE_URL + 'r/lifeline'; //ws://192.168.88.28:1984/lifeline';
  }

  get(key: string): string {
    const endpoint = this.endpoints[key];
    if (!endpoint) {
      console.error('Could not find endpoint with ', key);
    }
    return endpoint;
  }
}
