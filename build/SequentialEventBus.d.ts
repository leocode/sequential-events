import { ISequentialEventListener, IEvent } from './ISequentialEventListener';
/**
 * The main difference from the Nest EventBus is that event handlers must finish its work to proceed.
 */
export declare class SequentialEventBus {
    private listeners;
    register(handler: ISequentialEventListener<any>, eventType: string): void;
    publish(event: IEvent, tx: object | null): Promise<void>;
    publishAll(events: IEvent[], tx: object | null): Promise<void>;
}
