import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ModulesContainer, ModuleRef } from '@nestjs/core';
import { SEQUENTIAL_EVENT_LISTENER } from './decorators/SequentialEventListener';
import { SequentialEventBus } from './SequentialEventBus';
import { isEvent } from './ISequentialEventListener';

interface ListenerDefinition {
  providerConstructor: any;
  eventType: any;
}

@Module({
  providers: [SequentialEventBus],
  exports: [SequentialEventBus],
})
export class SequentialEventsModule implements OnApplicationBootstrap {
  public constructor(
    private readonly eventBus: SequentialEventBus,
    private readonly modulesContainer: ModulesContainer,
    private readonly moduleRef: ModuleRef,
  ) {}

  public onApplicationBootstrap() {
    const modules = [...this.modulesContainer.values()];
    const listenerDefinitions = modules.flatMap(module => {
      const providers = [...module.providers.values()];
      const listeners = providers.map(provider => {
        const instance: any = provider.instance;
        if (!instance || !instance.constructor) {
          return undefined;
        }
        const listenedEvent = Reflect.getMetadata(SEQUENTIAL_EVENT_LISTENER, instance.constructor);
        if (!listenedEvent && isEvent(listenedEvent) === false) {
          return undefined;
        }
        return { providerConstructor: instance.constructor, eventType: listenedEvent.type };
      });
      return listeners.filter(Boolean);
    }) as ListenerDefinition[];

    const listenerParis = listenerDefinitions.map(definition => {
      const instance = this.moduleRef.get(definition.providerConstructor, { strict: false });
      return { listener: instance, eventType: definition.eventType };
    });

    listenerParis.forEach(pair => {
      this.eventBus.register(pair.listener, pair.eventType);
    });
  }
}
