import type { Type } from '@nestjs/common';
import type { IEvent, ISequentialEventListener } from '../ISequentialEventListener';
import 'reflect-metadata';

export const SEQUENTIAL_EVENT_LISTENER = '__sequentialEventListener';

export class EventListenerMetadata {
  constructor(private readonly eventListenerConstructor: Type<ISequentialEventListener>) {
  }

  static from(eventListenerType: Type<ISequentialEventListener>) {
    return new EventListenerMetadata(eventListenerType);
  }

  static isEventListener(functionConstructor: FunctionConstructor) {
    if (!functionConstructor) {
      return false;
    }

    const metadata = Reflect.getMetadata(SEQUENTIAL_EVENT_LISTENER, functionConstructor);

    return Boolean(metadata);
  }

  public getEvents(): FunctionConstructor[] {
    return Reflect.getMetadata(SEQUENTIAL_EVENT_LISTENER, this.eventListenerConstructor);
  }

  public assignEvents(events: IEvent[]) {
    Reflect.defineMetadata(SEQUENTIAL_EVENT_LISTENER, events, this.eventListenerConstructor);
  }
}