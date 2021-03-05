import { OnApplicationBootstrap } from '@nestjs/common';
import { ModulesContainer, ModuleRef } from '@nestjs/core';
import { SequentialEventBus } from './SequentialEventBus';
export declare class SequentialEventsModule implements OnApplicationBootstrap {
    private readonly eventBus;
    private readonly modulesContainer;
    private readonly moduleRef;
    constructor(eventBus: SequentialEventBus, modulesContainer: ModulesContainer, moduleRef: ModuleRef);
    onApplicationBootstrap(): void;
}
