import type { IEvent, ISequentialEventListener } from '../src/ISequentialEventListener';
import { SequentialEventListener, SequentialEventsModule } from '../src';
import { Test } from '@nestjs/testing';

export class TestEvent implements IEvent {
  public payload = 'test';
}

export class OtherTestEvent implements IEvent {
  public payload = 'other_test';
}

@SequentialEventListener(TestEvent)
export class TestEventListener implements ISequentialEventListener<TestEvent> {
  constructor(private readonly mockFunction: jest.Mock) {
  }

  public async handle(
    event: IEvent,
    tx: Record<string, unknown>,
  ): Promise<void> {
    this.mockFunction(event, tx);
  }
}

@SequentialEventListener(TestEvent, OtherTestEvent)
export class TestTwoEventsListener implements ISequentialEventListener<TestEvent> {
  constructor(private readonly mockFunction: jest.Mock) {
  }

  public async handle(
    event: IEvent,
    tx: Record<string, unknown>,
  ): Promise<void> {
    this.mockFunction(event, tx);
  }
}

type ProviderWithMock = { provider: any; mock: any };

export const createTestApp = async (providersWithMocks: ProviderWithMock[]) => {
  const builder = await Test.createTestingModule({
    imports: [SequentialEventsModule],
    providers: providersWithMocks.map(({ provider }) => provider),
  });

  providersWithMocks.forEach(({ provider, mock }) => {
    builder.overrideProvider(provider).useValue(mock);
  });

  const moduleRef = await builder.compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  return app;
};
