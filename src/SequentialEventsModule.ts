import type { OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ModuleRef, ModulesContainer } from '@nestjs/core';
import { SequentialEventBus } from './SequentialEventBus';
import { SequentialEventListenersFinder } from './SequentialEventListenersFinder';

@Module({
  providers: [SequentialEventBus, SequentialEventListenersFinder],
  exports: [SequentialEventBus],
})
export class SequentialEventsModule implements OnModuleInit {
  public constructor(
        private readonly eventBus: SequentialEventBus,
        private readonly modulesContainer: ModulesContainer,
        private readonly sequentialEventExplorer: SequentialEventListenersFinder,
  ) {
  }

  public onModuleInit() {
    const modules = [...this.modulesContainer.values()];
    const eventListeners = this.sequentialEventExplorer.search(modules);
    this.eventBus.bindListeners(eventListeners);
  }

}
