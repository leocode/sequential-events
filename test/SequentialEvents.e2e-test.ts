import type { INestApplication } from '@nestjs/common';
import { SequentialEventBus } from '../src';
import {
  createTestApp,
  EVENT_CONTENT,
  TestEvent,
  TestEventListener,
} from './test.utils';

describe('SequentialEvents', () => {
  let app: INestApplication;

  it('should publish event to listener present in module', async () => {
    const handler = jest.fn();
    app = await createTestApp([
      { provider: TestEventListener, mock: new TestEventListener(handler) },
    ]);
    const eventBus = app.get<SequentialEventBus>(SequentialEventBus);

    await eventBus.publish(TestEvent, EVENT_CONTENT);

    expect(handler).toBeCalledTimes(1);
    expect(handler).toBeCalledWith(TestEvent, EVENT_CONTENT);
  });

  it('should publish multiple events to listener present in module', async () => {
    const handler = jest.fn();
    app = await createTestApp([
      { provider: TestEventListener, mock: new TestEventListener(handler) },
    ]);
    const eventBus = app.get<SequentialEventBus>(SequentialEventBus);

    await eventBus.publishAll([TestEvent, TestEvent], EVENT_CONTENT);

    expect(handler).toBeCalledTimes(2);
    expect(handler).toBeCalledWith(TestEvent, EVENT_CONTENT);
  });
});
