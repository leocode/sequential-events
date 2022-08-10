import type { IEvent, ISequentialEventListener } from './ISequentialEventListener';
import type { Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { SEQUENTIAL_EVENT, SEQUENTIAL_EVENT_LISTENER } from './constants';
import 'reflect-metadata';
import { Injectable } from '@nestjs/common';

/**
 * The main difference from the Nest EventBus is that event handlers must finish its work to proceed.
 *
 * Implementation for binding events based on https://github.com/nestjs/cqrs/blob/master/src/event-bus.ts
 */
@Injectable()
export class SequentialEventBus {
  private listeners: Map<string, ISequentialEventListener[]> = new Map();

  constructor(public moduleRef: ModuleRef) {
  }

  public register(handler: ISequentialEventListener<any>, id: string) {
    if (!this.listeners.has(id)) {
      this.listeners.set(id, []);
    }

        this.listeners.get(id)!.push(handler);
  }

  public async publish(event: IEvent, tx: object | null): Promise<void> {
    const eventCtor = Object.getPrototypeOf(event).constructor;
    const eventMetadata = Reflect.getMetadata(SEQUENTIAL_EVENT, eventCtor);
    const eventId = eventMetadata?.id;

    const listeners = this.listeners.get(eventId);

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
    eventListeners.forEach((handler) => {
      const instance = this.moduleRef.get(handler, { strict: false });
      if (!instance) {
        return;
      }
      const events = SequentialEventBus.reflectEvents(handler);
      events.map((event) =>
        this.register(
          instance,
          Reflect.getMetadata(SEQUENTIAL_EVENT, event).id,
        ),
      );
    });
  }

  private static reflectEvents(
    handler: Type<ISequentialEventListener>,
  ): FunctionConstructor[] {
    return Reflect.getMetadata(SEQUENTIAL_EVENT_LISTENER, handler);
  }
}
