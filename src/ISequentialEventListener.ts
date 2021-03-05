export interface IEvent {
  type: string;
}

export function isEvent(e: any): e is IEvent {
  return Boolean(e && e.type !== undefined);
}

export interface ISequentialEventListener<E extends IEvent = IEvent> {
  handle(event: E, tx: object | null): Promise<void>;
}
