import type { EventId, IEvent } from '../ISequentialEventListener';
import 'reflect-metadata';

export const SEQUENTIAL_EVENT = '__sequentialEvent';

export class EventMetadata {
  constructor(private readonly event: FunctionConstructor) {
  }

  static from(eventOrConstructor: FunctionConstructor | IEvent) {
    if (EventMetadata.isEventConstructor(eventOrConstructor)) {
      return new EventMetadata(eventOrConstructor);
    } else {
      return new EventMetadata(Object.getPrototypeOf(eventOrConstructor).constructor);
    }
  }

  public getEventId(): EventId {
    const eventMetadata = Reflect.getMetadata(SEQUENTIAL_EVENT, this.event);

    return eventMetadata?.id;
  }

  public assignId(id: EventId) {
    if (!Reflect.hasOwnMetadata(SEQUENTIAL_EVENT, this.event)) {
      Reflect.defineMetadata(SEQUENTIAL_EVENT, { id }, this.event);
    }
  }

  private static isEventConstructor(eventOrConstructor: FunctionConstructor | IEvent): eventOrConstructor is FunctionConstructor {
    return (eventOrConstructor as any)?.name;
  }
}
