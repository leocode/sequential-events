import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SequentialEventsModule } from '../SequentialEventsModule';
import type {
  IEvent,
  ISequentialEventListener,
} from '../ISequentialEventListener';
import { SequentialEventListener } from '../decorators/SequentialEventListener';
import { SequentialEventBus } from '../SequentialEventBus';

const TestEvent: IEvent = {
  type: 'TestEvent',
};
const EVENT_CONTENT = {};

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

describe('SequentialEvents', () => {
  let app: INestApplication;

  it('should publish event to listener present in module', async () => {
    const handler = jest.fn();
    const moduleRef = await Test.createTestingModule({
      imports: [SequentialEventsModule],
      providers: [TestEventListener],
    })
      .overrideProvider(TestEventListener)
      .useValue(new TestEventListener(handler))
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
    const eventBus = app.get<SequentialEventBus>(SequentialEventBus);

    await eventBus.publish(TestEvent, EVENT_CONTENT);

    expect(handler).toBeCalledTimes(1);
    expect(handler).toBeCalledWith(TestEvent, EVENT_CONTENT);
  });
});
