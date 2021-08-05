import type { IEvent } from '../ISequentialEventListener';
import 'reflect-metadata';
import { isEvent } from '../ISequentialEventListener';

export const SEQUENTIAL_EVENT_LISTENER = '__sequentialEventListener';

export const SequentialEventListener = (event: IEvent): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(SEQUENTIAL_EVENT_LISTENER, event, target);
  };
};

export const getListenedEvent = (
  constructor: Record<string, unknown>,
): IEvent | undefined => {
  const listenedEvent = Reflect.getMetadata(
    SEQUENTIAL_EVENT_LISTENER,
    constructor,
  );

  return isEvent(listenedEvent) ? listenedEvent : undefined;
};
