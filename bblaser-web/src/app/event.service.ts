import { EventEmitter, Injectable } from '@angular/core';


export const PAPER_PATH_SELECTED = 'paperPathSelected';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor() { }

  private events: EventEmitter<any> = new EventEmitter<any>();

  emit(event: string, data?: any) {
    this.events.emit({ name: event, data: data });
  }

  subscribe(callback: any) {
    return this.events.subscribe(callback);
  }

}
