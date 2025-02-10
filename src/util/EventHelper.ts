import {ConfigLayout} from "./ConfigHelper.ts";

type EventData = {
    forcePlaybackUpdate: undefined,
    configChanged: keyof ConfigLayout,
}

type EventNames = keyof EventData;

class EventHelperContainer {

    public notify<T extends EventNames>(eventName: T, data: EventData[T]): void {
        const event = new CustomEvent<EventData[T]>('custom:' + eventName, {
            detail: data
        });
        window.dispatchEvent(event);
    }

    public subscribe<T extends EventNames>(eventName: T, listener: {(event: CustomEvent<EventData[T]>): void}) {
        // typescript still has some problems with custom events, so we need to hide these here with type castings
        window.addEventListener(
            'custom:' + eventName as keyof WindowEventMap,
            listener as EventListener
        );
    }

    public unsubscribe<T extends EventNames>(eventName: T, listener: {(event: CustomEvent<EventData[T]>): void}) {
        // typescript still has some problems with custom events, so we need to hide these here with type castings
        window.removeEventListener(
            'custom:' + eventName as keyof WindowEventMap,
            listener as EventListener
        );
    }
}

const EventHelper = new EventHelperContainer();
export default EventHelper;