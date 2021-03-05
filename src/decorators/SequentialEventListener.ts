import { IEvent } from '../ISequentialEventListener';
import 'reflect-metadata';

export const SEQUENTIAL_EVENT_LISTENER = '__sequentialEventListener';

export const SequentialEventListener = (event: IEvent): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(SEQUENTIAL_EVENT_LISTENER, event, target);
  };
};
