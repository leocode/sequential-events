# sequential-events

**Library for NestJS**

Sequential events allows to separate contexts with events,
that (in opposite to https://docs.nestjs.com/recipes/cqrs) are evaluated sequentially (with optional transaction object passed around).

It is used to call actions from many domains, that together form one transaction.
If implementing process manager is overkill for you, `sequential-events` may be enough.

## Use cases

1. Process management (creating new tenant in application requiring creating entities in various domains)

## Requirements

Install peer dependencies (or not, if you already have them - if you are using Nest.js you probably already have them)

`yarn add @nestjs/common @nestjs/core reflect-metadata`

`npm install --save @nestjs/common @nestjs/core reflect-metadata`

## Installation

`yarn add @leocode/sequential-events`

`npm install --save @leocode/sequential-events`

## Usage

1. Import `SequentialEventsModule` into core application module
2. Import `SequentialEventBus` into module, that is going to publish event
3. Create event (see below)
4. Create listener (see below)
5. Publish event (see below)

### Creating event

Event needs to implement interface `IEvent` and it should be a class:

```ts
import { IEvent } from '@leocode/sequential-events';

export class TenantCreated implements IEvent {

  constructor (public tenantId: string) {};
}
```

### Creating listener

1. Create class which serves as a handler:

```ts
import { SequentialEventListener } from '@leocode/sequential-events';
import { ISequentialEventListener } from '@leocode/sequential-events';

@SequentialEventListener(TenantCreated)
export class CreateOnboarding implements ISequentialEventListener<TenantCreated, Transaction> {
  public constructor(
    private onboardingFacade: OnboardingFacade,
  ) {}

  public async handle(event: TenantCreated, tx: Transaction | null): Promise<void> {
    const tenantId = event.tenantId;

    await this.onboardingFacade.createAdminOnboarding({
      tenantId,
    }, tx);
  }
}
```

2. Add handler as module's provider

### Publish event

```ts
import { SequentialEventBus } from '@leocode/sequential-events';

@Injectable()
export class TenantService {
  public constructor (
    private sequentialEventBus: SequentialEventBus,
  ) {}

  public async createTenant(...) {
    const transaction = ...;

    const tenantId = ...;
    const user = await this.createUser(..., transaction);

    await this.sequentialEventBus.publishAll([
      new TenantCreated(tenantId)
    ], transaction);

    return user;
  }
}
```
