import type { INestApplication } from '@nestjs/common';
import { SequentialEventBus } from '../src';
import {
  createTestApp,
  TestEvent,
  TestEventListener,
} from './test.utils';

describe('SequentialEvents', () => {
  let app: INestApplication;

  it.only('should publish event to listener present in module', async () => {
    const handler = jest.fn();
    app = await createTestApp([
      { provider: TestEventListener, mock: new TestEventListener(handler) },
    ]);
    const eventBus = app.get<SequentialEventBus>(SequentialEventBus);

    const instance = new TestEvent();
    await eventBus.publish(instance, null);

    expect(handler).toBeCalledTimes(1);
    expect(handler).toBeCalledWith(instance, null);
  });

  it('should publish multiple events to listener present in module', async () => {
    const handler = jest.fn();
    app = await createTestApp([
      { provider: TestEventListener, mock: new TestEventListener(handler) },
    ]);
    const eventBus = app.get<SequentialEventBus>(SequentialEventBus);

    const instance = new TestEvent();
    await eventBus.publishAll([instance, instance], null);

    expect(handler).toBeCalledTimes(2);
    expect(handler).toBeCalledWith(instance, null);
  });
});
