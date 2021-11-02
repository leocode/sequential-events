import { ISequentialEventListener, IEvent, IEventConstructor } from './ISequentialEventListener';

/**
 * The main difference from the Nest EventBus is that event handlers must finish its work to proceed.
 */
export class SequentialEventBus {
  private listeners: Map<IEventConstructor, ISequentialEventListener[]> = new Map();

  public register(handler: ISequentialEventListener<any>, eventCtor: IEventConstructor) {
    if (!this.listeners.has(eventCtor)) {
      this.listeners.set(eventCtor, []);
    }

    this.listeners.get(eventCtor)!.push(handler);
  }

  public async publish(event: IEvent, tx: object | null): Promise<void> {
    const eventCtor = Object.getPrototypeOf(event).constructor;

    const listeners = this.listeners.get(eventCtor);

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
