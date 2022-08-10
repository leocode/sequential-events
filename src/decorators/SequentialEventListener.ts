import type {IEvent} from '../ISequentialEventListener';
import 'reflect-metadata';
import {randomUUID} from 'crypto';
import {SEQUENTIAL_EVENT, SEQUENTIAL_EVENT_LISTENER} from '../constants';

export const SequentialEventListener = (...events: IEvent[]): ClassDecorator => {
  return (target: object) => {
    events.forEach((event) => {
      if (!Reflect.hasOwnMetadata(SEQUENTIAL_EVENT, event)) {
        Reflect.defineMetadata(SEQUENTIAL_EVENT, {id: randomUUID()}, event);
      }
    });

    Reflect.defineMetadata(SEQUENTIAL_EVENT_LISTENER, events, target);
  };
};
