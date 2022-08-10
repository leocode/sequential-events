import type {INestApplication} from '@nestjs/common';
import {SequentialEventBus} from '../src';
import {
  createTestApp, OtherTestEvent,
  TestEvent,
  TestEventListener, TestTwoEventsListener,
} from './test.utils';

describe('SequentialEvents', () => {
  let app: INestApplication;

  it('should publish event to listener present in module', async () => {
    const handler = jest.fn();
    app = await createTestApp([
      {provider: TestEventListener, mock: new TestEventListener(handler)},
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
      {provider: TestEventListener, mock: new TestEventListener(handler)},
    ]);
    const eventBus = app.get<SequentialEventBus>(SequentialEventBus);

    const instance = new TestEvent();
    await eventBus.publishAll([instance, instance], null);

    expect(handler).toBeCalledTimes(2);
    expect(handler).toBeCalledWith(instance, null);
  });

  it('should allow to define listener for two events', async () => {
    const handler = jest.fn();
    app = await createTestApp([
      {provider: TestTwoEventsListener, mock: new TestTwoEventsListener(handler)},
    ]);
    const eventBus = app.get<SequentialEventBus>(SequentialEventBus);

    // Handle first type of event
    const firstTypeOfEvent = new TestEvent();
    await eventBus.publishAll([firstTypeOfEvent, firstTypeOfEvent], null);

    expect(handler).toBeCalledTimes(2);
    expect(handler).toBeCalledWith(firstTypeOfEvent, null);

    // Reset counters and see if the other type of event is also handled
    jest.resetAllMocks();
    const otherEvent = new OtherTestEvent();
    await eventBus.publishAll([otherEvent, otherEvent], null);

    expect(handler).toBeCalledTimes(2);
    expect(handler).toBeCalledWith(otherEvent, null);
  });
});
