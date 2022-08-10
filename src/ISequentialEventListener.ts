export interface IEvent {}

export interface ISequentialEventListener<E extends IEvent = IEvent, T = any> {
  handle(event: E, tx: T | null): Promise<void>;
}
