import type { OnApplicationBootstrap } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ModuleRef, ModulesContainer } from '@nestjs/core';
import { getListenedEvent } from './decorators/SequentialEventListener';
import { SequentialEventBus } from './SequentialEventBus';

interface ListenerDefinition {
  providerConstructor: any;
  eventConstructor: any;
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
    const listenerDefinitions = [...this.modulesContainer.values()]
      .flatMap((module) => [...module.providers.values()])
      .filter((provider) => (provider.instance as any)?.constructor)
      .filter((provider) =>
        getListenedEvent((provider.instance as any).constructor),
      )
      .map((provider) => {
        const instance = provider.instance as any;

        const listenedEvent = getListenedEvent(instance.constructor)!;

        return {
          providerConstructor: instance.constructor,
          eventConstructor: listenedEvent,
        } as ListenerDefinition;
      });

    listenerDefinitions.forEach((definition) => {
      const instance = this.moduleRef.get(definition.providerConstructor, {
        strict: false,
      });

      this.eventBus.register(instance, definition.eventConstructor);
    });
  }
}
