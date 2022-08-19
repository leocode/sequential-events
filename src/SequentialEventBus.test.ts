import { SequentialEventBus } from './SequentialEventBus';
import type { IEvent } from './ISequentialEventListener';
import { SEQUENTIAL_EVENT } from './metadata/EventMetadata';

class EVENT implements IEvent {
  public payload = 'test';
}

const tx = { someContent: 'content' };

const createEvent = (event: any) => {
  const eventId = event.constructor.name;
  Reflect.defineMetadata(SEQUENTIAL_EVENT, { id: eventId }, event.constructor);

  return { event, eventId };
};

describe('SequentialEventBus', () => {
  let eventBus: SequentialEventBus;

  beforeEach(() => {
    eventBus = new SequentialEventBus(null as any);
  });

  describe('#publish', () => {
    it('should publish event to registered handler', () => {
      const handleFunctionMock = jest.fn();
      const handler = { handle: handleFunctionMock };
      const { event, eventId } = createEvent(new EVENT());
      eventBus.register(handler, eventId);

      eventBus.publish(event, tx);

      expect(handleFunctionMock).toBeCalledTimes(1);
      expect(handleFunctionMock).toBeCalledWith(event, tx);
    });

    it('should publish event to multiple handlers', () => {
      const handleFunctionMock = jest.fn();
      const handler = { handle: handleFunctionMock };
      const { event, eventId } = createEvent(new EVENT());
      eventBus.register(handler, eventId);
      eventBus.register(handler, eventId);

      eventBus.publish(event, tx);

      expect(handleFunctionMock).toBeCalledTimes(2);
      expect(handleFunctionMock).toBeCalledWith(event, tx);
    });

    it('should publish event with no handlers registered', () => {
      const { event } = createEvent(new EVENT());

      eventBus.publish(event, tx);
    });
  });
  describe('#publishAll', () => {
    it('should publish multiple events of the same type', () => {
      const handleFunctionMock = jest.fn();
      const handler = { handle: handleFunctionMock };
      const { event, eventId } = createEvent(new EVENT());
      eventBus.register(handler, eventId);

      eventBus.publishAll([event, event, event], tx);

      expect(handleFunctionMock).toBeCalledTimes(3);
      expect(handleFunctionMock).toBeCalledWith(event, tx);
    });

    it('should publish multiple events of the same type to multiple handlers', () => {
      const handleFunctionMock = jest.fn();
      const handler = { handle: handleFunctionMock };
      const { event, eventId } = createEvent(new EVENT());
      eventBus.register(handler, eventId);
      eventBus.register(handler, eventId);

      eventBus.publishAll([event, event, event], tx);

      expect(handleFunctionMock).toBeCalledTimes(6);
      expect(handleFunctionMock).toBeCalledWith(event, tx);
    });

    it('should publish different events to multiple handlers', () => {
      const firstHandle = jest.fn();

      class FirstEvent implements IEvent {
      }

      const { eventId: firstEventId, event: firstEvent } = createEvent(new FirstEvent());

      const secondHandle = jest.fn();

      class SecondEvent implements IEvent {
      }

      const { eventId: secondEventId, event: secondEvent } = createEvent(new SecondEvent());

      eventBus.register({ handle: firstHandle }, firstEventId);
      eventBus.register({ handle: secondHandle }, secondEventId);

      eventBus.publishAll([firstEvent, firstEvent, secondEvent], tx);

      expect(firstHandle).toBeCalledTimes(2);
      expect(firstHandle).toBeCalledWith(firstEvent, tx);
      expect(secondHandle).toBeCalledTimes(1);
      expect(secondHandle).toBeCalledWith(secondEvent, tx);
    });
  });
});
