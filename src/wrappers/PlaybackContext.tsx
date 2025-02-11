import {Episode, PlaybackState, Track} from "@spotify/web-api-ts-sdk";
import {createContext} from "react";

type PlaybackContextObject = {
    state: PlaybackState | undefined,
    item: Track | Episode | undefined,
}

export const PlaybackContext = createContext<PlaybackContextObject>({
    state: undefined,
    item: undefined,
});