import { Injectable } from '@nestjs/common';
import type { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import type { Module as ModuleType } from '@nestjs/core/injector/module';
import { EventListenerMetadata } from './metadata/EventListenerMetadata';

@Injectable()
export class SequentialEventListenersFinder {

  /*
     * Looks through the modules to find defined event listeners.
     * Recognizes event listeners by defined metadata.
     * */
  public search(modules: ModuleType[]) {
    return modules.flatMap(module => {
      const providers = [...module.providers.values()];

      return providers
        .map((instanceWrapper: InstanceWrapper) => instanceWrapper.instance?.constructor)
        .filter(provider => EventListenerMetadata.isEventListener(provider));
    });
  }
}