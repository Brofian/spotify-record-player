import {PlaybackState, Track} from "@spotify/web-api-ts-sdk";
import {ReactNode, useEffect, useState} from "react";
import SpotifyManager from "../util/SpotifyManager.ts";
import {PlaybackContext} from "./PlaybackContext.tsx";


export default function PlaybackContextWrapper(props: {children: ReactNode}) {
    const [getLastPlaybackState, setLastPlaybackState] = useState<PlaybackState | null>(null);
    const [getTrack, setTrack] = useState<Track | null>(null);

    useEffect(() => {

        const updatePlaybackState = (playbackState: PlaybackState) => {
            if (playbackState && playbackState.item) {
                SpotifyManager.sdk.tracks.get(playbackState.item.id).then(setTrack);
            }
            else {
                setTrack(null);
            }
            setLastPlaybackState(playbackState);
        };

        if (getLastPlaybackState === undefined) {
            SpotifyManager.sdk.player.getCurrentlyPlayingTrack().then(updatePlaybackState);
        }

        const updateLastItemIntervalHandler = async () => {
            const playbackState = await SpotifyManager.sdk.player.getPlaybackState();

            if (!getLastPlaybackState || !playbackState) {
                if (playbackState !== getLastPlaybackState) updatePlaybackState(playbackState);
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
                updatePlaybackState(playbackState);
            }
        };

        const intervalId = window.setInterval(updateLastItemIntervalHandler, 3000);
        window.setTimeout(updateLastItemIntervalHandler, 100);
        window.addEventListener('force-context-update', updateLastItemIntervalHandler);

        return () => {
            window.clearInterval(intervalId);
            window.removeEventListener('force-context-update', updateLastItemIntervalHandler)
        };

    }, [getLastPlaybackState]);


    return <PlaybackContext.Provider value={{
        state: getLastPlaybackState || undefined,
        track: getTrack || undefined,
    }}>
        {props.children}
    </PlaybackContext.Provider>
}