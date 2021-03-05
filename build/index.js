'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var common = require('@nestjs/common');
var core = require('@nestjs/core');
require('reflect-metadata');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

const SEQUENTIAL_EVENT_LISTENER = '__sequentialEventListener';
const SequentialEventListener = (event) => {
    return (target) => {
        Reflect.defineMetadata(SEQUENTIAL_EVENT_LISTENER, event, target);
    };
};

/**
 * The main difference from the Nest EventBus is that event handlers must finish its work to proceed.
 */
class SequentialEventBus {
    constructor() {
        this.listeners = {};
    }
    register(handler, eventType) {
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = [];
        }
        this.listeners[eventType].push(handler);
    }
    async publish(event, tx) {
        const listeners = this.listeners[event.type];
        if (listeners) {
            await Promise.all(listeners.map(async (listener) => {
                return await listener.handle(event, tx);
            }));
        }
    }
    async publishAll(events, tx) {
        await Promise.all(events.map(async (event) => await this.publish(event, tx)));
    }
}

function isEvent(e) {
    return Boolean(e && e.type !== undefined);
}

exports.SequentialEventsModule = class SequentialEventsModule {
    constructor(eventBus, modulesContainer, moduleRef) {
        this.eventBus = eventBus;
        this.modulesContainer = modulesContainer;
        this.moduleRef = moduleRef;
    }
    onApplicationBootstrap() {
        const modules = [...this.modulesContainer.values()];
        const listenerDefinitions = modules.flatMap(module => {
            const providers = [...module.providers.values()];
            const listeners = providers.map(provider => {
                const instance = provider.instance;
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
        });
        const listenerParis = listenerDefinitions.map(definition => {
            const instance = this.moduleRef.get(definition.providerConstructor, { strict: false });
            return { listener: instance, eventType: definition.eventType };
        });
        listenerParis.forEach(pair => {
            this.eventBus.register(pair.listener, pair.eventType);
        });
    }
};
exports.SequentialEventsModule = __decorate([
    common.Module({
        providers: [SequentialEventBus],
        exports: [SequentialEventBus],
    }),
    __metadata("design:paramtypes", [SequentialEventBus,
        core.ModulesContainer,
        core.ModuleRef])
], exports.SequentialEventsModule);

exports.SequentialEventBus = SequentialEventBus;
exports.SequentialEventListener = SequentialEventListener;
