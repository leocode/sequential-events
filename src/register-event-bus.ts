import { SEQUENTIAL_EVENT_LISTENER } from './decorators/SequentialEventListener';
import { isEvent } from './ISequentialEventListener';
import type { ModuleRef, ModulesContainer } from '@nestjs/core';
import type { SequentialEventBus } from './SequentialEventBus';

interface ListenerDefinition {
  providerConstructor: any;
  eventType: any;
}

export const registerEventBus = (modulesContainer: ModulesContainer, moduleRef: ModuleRef, eventBus: SequentialEventBus) => {
  const modules = [...modulesContainer.values()];
  const listenerDefinitions = modules.flatMap((module) => {
    const providers = [...module.providers.values()];
    const listeners = providers.map((provider) => {
      const instance: any = provider.instance;
      if (!instance || !instance.constructor) {
        return undefined;
      }
      const listenedEvent = Reflect.getMetadata(
        SEQUENTIAL_EVENT_LISTENER,
        instance.constructor,
      );
      if (!listenedEvent && isEvent(listenedEvent) === false) {
        return undefined;
      }
      return {
        providerConstructor: instance.constructor,
        eventType: listenedEvent.type,
      };
    });
    return listeners.filter(Boolean);
  }) as ListenerDefinition[];

  const listenerPairs = listenerDefinitions.map((definition) => {
    const instance = moduleRef.get(definition.providerConstructor, {
      strict: false,
    });
    return { listener: instance, eventType: definition.eventType };
  });

  listenerPairs.forEach((pair) => {
    eventBus.register(pair.listener, pair.eventType);
  });
};
