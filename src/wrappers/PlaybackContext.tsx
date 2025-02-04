import {PlaybackState, Track} from "@spotify/web-api-ts-sdk";
import {createContext} from "react";

type PlaybackContextObject = {
    state: PlaybackState | undefined,
    track: Track | undefined,
}

export const PlaybackContext = createContext<PlaybackContextObject>({
    state: undefined,
    track: undefined,
});