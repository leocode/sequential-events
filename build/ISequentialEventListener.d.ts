export interface IEvent {
    type: string;
}
export declare function isEvent(e: any): e is IEvent;
export interface ISequentialEventListener<E extends IEvent = IEvent> {
    handle(event: E, tx: object | null): Promise<void>;
}
