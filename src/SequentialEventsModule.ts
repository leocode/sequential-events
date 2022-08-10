import type { OnApplicationBootstrap } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { SequentialEventBus } from './SequentialEventBus';
import { SequentialEventListenersFinder } from './SequentialEventListenersFinder';

@Module({
  providers: [SequentialEventBus, SequentialEventListenersFinder],
  exports: [SequentialEventBus],
})
export class SequentialEventsModule implements OnApplicationBootstrap {
  public constructor(
        private readonly eventBus: SequentialEventBus,
        private readonly modulesContainer: ModulesContainer,
        private readonly sequentialEventListenersFinder: SequentialEventListenersFinder,
  ) {
  }

  public onApplicationBootstrap() {
    const modules = [...this.modulesContainer.values()];
    const eventListeners = this.sequentialEventListenersFinder.search(modules);
    this.eventBus.bindListeners(eventListeners);
  }

}
