import type {
  IEvent,
  ISequentialEventListener,
} from '../src/ISequentialEventListener';
import { SequentialEventListener, SequentialEventsModule } from '../src';
import { Test } from '@nestjs/testing';

export const TestEvent: IEvent = {
  type: 'TestEvent',
};
export const EVENT_CONTENT = {};

@SequentialEventListener(TestEvent)
export class TestEventListener implements ISequentialEventListener {
  constructor(private readonly mockFunction: jest.Mock) {}

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
