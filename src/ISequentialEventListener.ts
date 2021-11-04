export interface IEvent {}

export type IEventConstructor = { new(...args: any[]): IEvent; }

export interface ISequentialEventListener<E extends IEvent = IEvent, T = any> {
  handle(event: E, tx: T | null): Promise<void>;
}
