import { SequentialEventBus } from './SequentialEventBus';
import type { IEvent } from './ISequentialEventListener';

class EVENT implements IEvent {
  public payload = 'test';
}

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
      eventBus.register(handler, EVENT);

      const instance = new EVENT();
      eventBus.publish(instance, tx);

      expect(handleFunctionMock).toBeCalledTimes(1);
      expect(handleFunctionMock).toBeCalledWith(instance, tx);
    });

    it('should publish event to multiple handlers', () => {
      const handleFunctionMock = jest.fn();
      const handler = { handle: handleFunctionMock };
      eventBus.register(handler, EVENT);
      eventBus.register(handler, EVENT);

      const instance = new EVENT();
      eventBus.publish(instance, tx);

      expect(handleFunctionMock).toBeCalledTimes(2);
      expect(handleFunctionMock).toBeCalledWith(instance, tx);
    });

    it('should publish event with no handlers registered', () => {
      eventBus.publish(EVENT, tx);
    });
  });
  describe('#publishAll', () => {
    it('should publish multiple events of the same type', () => {
      const handleFunctionMock = jest.fn();
      const handler = { handle: handleFunctionMock };
      eventBus.register(handler, EVENT);
      
      const instance = new EVENT();
      eventBus.publishAll([instance, instance, instance], tx);

      expect(handleFunctionMock).toBeCalledTimes(3);
      expect(handleFunctionMock).toBeCalledWith(instance, tx);
    });

    it('should publish multiple events of the same type to multiple handlers', () => {
      const handleFunctionMock = jest.fn();
      const handler = { handle: handleFunctionMock };
      eventBus.register(handler, EVENT);
      eventBus.register(handler, EVENT);

      const instance = new EVENT();
      eventBus.publishAll([instance, instance, instance], tx);

      expect(handleFunctionMock).toBeCalledTimes(6);
      expect(handleFunctionMock).toBeCalledWith(instance, tx);
    });

    it('should publish different events to multiple handlers', () => {
      const firstHandle = jest.fn();
      class FirstEvent implements IEvent {}

      const secondHandle = jest.fn();
      class SecondEvent implements IEvent {}

      eventBus.register({ handle: firstHandle }, FirstEvent);
      eventBus.register({ handle: secondHandle }, SecondEvent);

      const firstEvent = new FirstEvent();
      const secondEvent = new SecondEvent();
      eventBus.publishAll([firstEvent, firstEvent, secondEvent], tx);

      expect(firstHandle).toBeCalledTimes(2);
      expect(firstHandle).toBeCalledWith(firstEvent, tx);
      expect(secondHandle).toBeCalledTimes(1);
      expect(secondHandle).toBeCalledWith(secondEvent, tx);
    });
  });
});
