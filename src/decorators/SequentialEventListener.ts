import type { IEvent, ISequentialEventListener } from '../ISequentialEventListener';
import 'reflect-metadata';
import { EventMetadata } from '../metadata/EventMetadata';
import { randomUUID } from 'crypto';
import { EventListenerMetadata } from '../metadata/EventListenerMetadata';
import type { Type } from '@nestjs/common';

export const SequentialEventListener = (...events: IEvent[]): ClassDecorator => {
  return (target: object) => {
    events.forEach((event) => {
      EventMetadata.from(event).assignId(randomUUID());
    });

    EventListenerMetadata.from(target as Type<ISequentialEventListener>).assignEvents(events);
  };
};
