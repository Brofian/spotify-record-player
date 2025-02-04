import {PlaybackState} from "@spotify/web-api-ts-sdk";
import {ReactNode, useEffect, useState} from "react";
import SpotifyManager from "../util/SpotifyManager.ts";
import {PlaybackContext} from "./PlaybackContext.tsx";


export default function PlaybackContextWrapper(props: {children: ReactNode}) {
    const [getLastPlaybackState, setLastPlaybackState] = useState<PlaybackState | null>(null);

    useEffect(() => {

        if (getLastPlaybackState === undefined) {
            SpotifyManager.sdk.player.getCurrentlyPlayingTrack().then(setLastPlaybackState);
        }

        const updateLastItemIntervalHandler = (playbackState: PlaybackState) => {
            if (!getLastPlaybackState || !playbackState) {
                if (playbackState !== getLastPlaybackState) setLastPlaybackState(playbackState);
                return;
            }

            if (
                (playbackState.item === null) !== (getLastPlaybackState.item === null) ||
                (playbackState.item !== null && playbackState.item.id !== getLastPlaybackState.item.id) ||
                playbackState.is_playing !== getLastPlaybackState.is_playing ||
                playbackState.repeat_state !== getLastPlaybackState.repeat_state ||
                (playbackState.device === null) !== (getLastPlaybackState.device === null) ||
                playbackState.device !== null && (playbackState.device.id !== getLastPlaybackState.device.id)
            ) {
                setLastPlaybackState(playbackState);
            }
        };

        const intervalId = window.setInterval(
            () => SpotifyManager.sdk.player.getPlaybackState().then(updateLastItemIntervalHandler),
            3000
        );

        return () => {
            window.clearInterval(intervalId);
        };

    }, [getLastPlaybackState]);


    console.log('rerender playback context');

    return <PlaybackContext.Provider value={getLastPlaybackState || undefined}>
        {props.children}
    </PlaybackContext.Provider>
}