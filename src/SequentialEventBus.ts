import { ISequentialEventListener, IEvent } from './ISequentialEventListener';

/**
 * The main difference from the Nest EventBus is that event handlers must finish its work to proceed.
 */
export class SequentialEventBus {
  private listeners: { [eventType: string]: ISequentialEventListener[] } = {};

  public register(handler: ISequentialEventListener<any>, eventType: string) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(handler);
  }

  public async publish(event: IEvent, tx: object | null): Promise<void> {
    const listeners = this.listeners[event.type];
    if (listeners) {
      await Promise.all(listeners.map(async listener => {
        return await listener.handle(event, tx);
      }));
    }
  }

  public async publishAll(events: IEvent[], tx: object | null): Promise<void> {
    await Promise.all(events.map(async event => await this.publish(event, tx)));
  }
}
