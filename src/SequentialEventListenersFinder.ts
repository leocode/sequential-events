import type { ISequentialEventListener } from './ISequentialEventListener';
import type { Type } from '@nestjs/common';
import type { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import type { Module as ModuleType } from '@nestjs/core/injector/module';
import { SEQUENTIAL_EVENT_LISTENER } from './constants';
import { Injectable } from '@nestjs/common';

/*
* Implementation based on https://github.com/nestjs/cqrs/blob/master/src/services/explorer.service.ts
* */
@Injectable()
export class SequentialEventListenersFinder {
  public search(modules: ModuleType[]) {
    return this.flatMap<ISequentialEventListener>(modules, (instance) =>
      SequentialEventListenersFinder.filterProvider(instance, SEQUENTIAL_EVENT_LISTENER),
    );
  }

  private flatMap<T>(
    modules: ModuleType[],
    callback: (instance: InstanceWrapper) => Type | undefined,
  ): Type<T>[] {
    const items = modules
      .map((module) => [...module.providers.values()].map(callback))
      .reduce((a, b) => a.concat(b), []);
    return items.filter((element) => !!element) as Type<T>[];
  }

  private static filterProvider(
    wrapper: InstanceWrapper,
    metadataKey: string,
  ): Type | undefined {
    const { instance } = wrapper;
    if (!instance) {
      return undefined;
    }
    return SequentialEventListenersFinder.extractMetadata(instance, metadataKey);
  }

  private static extractMetadata(
    instance: Record<string, any>,
    metadataKey: string,
  ): Type | undefined {
    if (!instance.constructor) {
      return;
    }
    const metadata = Reflect.getMetadata(metadataKey, instance.constructor);
    return metadata ? (instance.constructor as Type) : undefined;
  }
}
