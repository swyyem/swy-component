type EventCallback = (data?: Record<string, any>) => boolean | void;
declare class ChainEventBus {
    private events;
    on(type: string, callback: EventCallback): this;
    emit(type: string, data?: Record<string, any>): Promise<boolean>;
    off(type: string, callback: EventCallback): this;
    offAll(): this;
}
export default ChainEventBus;
export type ChainEventBusInstance = InstanceType<typeof ChainEventBus>;
