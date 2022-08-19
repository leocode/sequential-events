import type { EventId, IEvent, ISequentialEventListener } from './ISequentialEventListener';
import type { Type } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { EventMetadata } from './metadata/EventMetadata';
import { EventListenerMetadata } from './metadata/EventListenerMetadata';

/**
 * The main difference from the Nest EventBus is that event handlers must finish its work to proceed.
 *
 * Implementation for binding events based on https://github.com/nestjs/cqrs/blob/master/src/event-bus.ts
 */
@Injectable()
export class SequentialEventBus {
  private eventListeners: Map<EventId, ISequentialEventListener[]> = new Map();

  constructor(public moduleRef: ModuleRef) {
  }

  public register(handler: ISequentialEventListener<any>, eventId: EventId) {
    if (!this.eventListeners.has(eventId)) {
      this.eventListeners.set(eventId, []);
    }

    this.eventListeners.get(eventId)!.push(handler);
  }

  public async publish(event: IEvent, tx: object | null): Promise<void> {
    const eventId = EventMetadata.from(event).getEventId();

    const listeners = this.eventListeners.get(eventId);

    if (listeners) {
      await Promise.all(listeners.map(async listener => {
        return await listener.handle(event, tx);
      }));
    }
  }

  public async publishAll(events: IEvent[], tx: object | null): Promise<void> {
    await Promise.all(events.map(async event => await this.publish(event, tx)));
  }

  public bindListeners(eventListeners: Type<ISequentialEventListener>[]) {
    eventListeners.forEach((eventListener) => {
      const resolvedInstance = this.moduleRef.get(eventListener, { strict: false });
      if (!resolvedInstance) {
        return;
      }

      const events = EventListenerMetadata.from(eventListener).getEvents();

      events.map((event) =>
        this.register(
          resolvedInstance,
          EventMetadata.from(event).getEventId(),
        ),
      );
    });
  }
}
