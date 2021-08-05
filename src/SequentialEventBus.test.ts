import { SequentialEventBus } from './SequentialEventBus';
import type { IEvent } from './ISequentialEventListener';

const EVENT_TYPE = 'eventType';
const EVENT: IEvent = { type: 'eventType' };
const tx = { someContent: 'content' };

describe('SequentialEventBus', () => {
  let eventBus: SequentialEventBus;

  beforeEach(() => {
    eventBus = new SequentialEventBus();
  });

  describe('#publish', () => {
    it('should publish event to registered handler', () => {
      const handleFunctionMock = jest.fn();
      const handler = { handle: handleFunctionMock };
      eventBus.register(handler, EVENT_TYPE);

      eventBus.publish(EVENT, tx);

      expect(handleFunctionMock).toBeCalledTimes(1);
      expect(handleFunctionMock).toBeCalledWith(EVENT, tx);
    });

    it('should publish event to multiple handlers', () => {
      const handleFunctionMock = jest.fn();
      const handler = { handle: handleFunctionMock };
      eventBus.register(handler, EVENT_TYPE);
      eventBus.register(handler, EVENT_TYPE);

      eventBus.publish(EVENT, tx);

      expect(handleFunctionMock).toBeCalledTimes(2);
      expect(handleFunctionMock).toBeCalledWith(EVENT, tx);
    });

    it('should publish event with no handlers registered', () => {
      eventBus.publish(EVENT, tx);
    });
  });
  describe('#publishAll', () => {
    it('should publish multiple events of the same type', () => {
      const handleFunctionMock = jest.fn();
      const handler = { handle: handleFunctionMock };
      eventBus.register(handler, EVENT_TYPE);

      eventBus.publishAll([EVENT, EVENT, EVENT], tx);

      expect(handleFunctionMock).toBeCalledTimes(3);
      expect(handleFunctionMock).toBeCalledWith(EVENT, tx);
    });

    it('should publish multiple events of the same type to multiple handlers', () => {
      const handleFunctionMock = jest.fn();
      const handler = { handle: handleFunctionMock };
      eventBus.register(handler, EVENT_TYPE);
      eventBus.register(handler, EVENT_TYPE);

      eventBus.publishAll([EVENT, EVENT, EVENT], tx);

      expect(handleFunctionMock).toBeCalledTimes(6);
      expect(handleFunctionMock).toBeCalledWith(EVENT, tx);
    });

    it('should publish different events to multiple handlers', () => {
      const firstHandle = jest.fn();
      const firstEventName = 'firstEvent';
      const firstEvent = { type: firstEventName };

      const secondHandle = jest.fn();
      const secondEventName = 'secondEvent';
      const secondEvent = { type: secondEventName };

      eventBus.register({ handle: firstHandle }, firstEventName);
      eventBus.register({ handle: secondHandle }, secondEventName);

      eventBus.publishAll([firstEvent, firstEvent, secondEvent], tx);

      expect(firstHandle).toBeCalledTimes(2);
      expect(firstHandle).toBeCalledWith(firstEvent, tx);
      expect(secondHandle).toBeCalledTimes(1);
      expect(secondHandle).toBeCalledWith(secondEvent, tx);
    });
  });
});
