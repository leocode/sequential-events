import type { IEventConstructor } from '../ISequentialEventListener';
import 'reflect-metadata';

export const SEQUENTIAL_EVENT_LISTENER = '__sequentialEventListener';

export const SequentialEventListener = (event: IEventConstructor): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(SEQUENTIAL_EVENT_LISTENER, event, target);
  };
};

export const getListenedEvent = (
  constructor: Record<string, unknown>,
): IEventConstructor | undefined => {
  const listenedEvent = Reflect.getMetadata(
    SEQUENTIAL_EVENT_LISTENER,
    constructor,
  );

  return listenedEvent ?? undefined;
};
