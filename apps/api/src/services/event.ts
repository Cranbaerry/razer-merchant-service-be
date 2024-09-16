export abstract class OnEmitEvent<T> {
  public abstract emitEvent(event: T): void;
}
