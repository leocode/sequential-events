export interface IEvent {
}

export type EventId = string;

export interface ISequentialEventListener<Event extends IEvent = IEvent, Transaction = any> {
    handle(event: Event, tx: Transaction | null): Promise<void>;
}
