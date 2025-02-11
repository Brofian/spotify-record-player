import {Episode, Market, PlaybackState, Track, UserProfile} from "@spotify/web-api-ts-sdk";
import {ReactNode, useEffect, useState} from "react";
import EventHelper from "../util/EventHelper.ts";
import SpotifyManager from "../util/SpotifyManager.ts";
import {PlaybackContext} from "./PlaybackContext.tsx";


export default function PlaybackContextWrapper(props: {children: ReactNode}) {
    const [getLastPlaybackState, setLastPlaybackState] = useState<PlaybackState | null>(null);
    const [getTrack, setTrack] = useState<Track | null>(null);
    const [getEpisode, setEpisode] = useState<Episode | null>(null);
    const [getProfile, setProfile] = useState<UserProfile | undefined | null>(undefined);

    useEffect(() => {

        if (getProfile === undefined) {
            setProfile(null);
            SpotifyManager.sdk.currentUser.profile().then(setProfile);
        }

        const updatePlaybackState = async (playbackState: PlaybackState) => {
            if (playbackState && playbackState.item) {
                switch (playbackState.currently_playing_type) {
                    case "track":
                        SpotifyManager.sdk.tracks.get(playbackState.item.id).then(setTrack);
                        setEpisode(null);
                        break;
                    case "episode":
                        SpotifyManager.sdk.episodes.get(playbackState.item.id, (getProfile?.country || 'DE') as Market).then(setEpisode);
                        setTrack(null);
                        break;
                }
            }
            else {
                setTrack(null);
                setEpisode(null);
            }
            setLastPlaybackState(playbackState);
        };

        if (getLastPlaybackState === undefined) {
            SpotifyManager.sdk.player.getCurrentlyPlayingTrack().then(updatePlaybackState);
        }

        const updateLastItemIntervalHandler = async () => {
            const me = await SpotifyManager.sdk.currentUser.profile();
            const playbackState = await SpotifyManager.sdk.player.getPlaybackState(
                me.country as Market,
                'episode'
            );

            if (!getLastPlaybackState || !playbackState) {
                if (playbackState !== getLastPlaybackState) await updatePlaybackState(playbackState);
                return;
            }

            if (
                (playbackState.item === null) !== (getLastPlaybackState.item === null) ||
                (playbackState.item !== null && playbackState.item.id !== getLastPlaybackState.item.id) ||
                playbackState.is_playing !== getLastPlaybackState.is_playing ||
                playbackState.repeat_state !== getLastPlaybackState.repeat_state ||
                playbackState.shuffle_state !== getLastPlaybackState.shuffle_state ||
                (playbackState.device === null) !== (getLastPlaybackState.device === null) ||
                playbackState.device !== null && (playbackState.device.id !== getLastPlaybackState.device.id)
            ) {
                await updatePlaybackState(playbackState);
            }
        };

        const intervalId = window.setInterval(updateLastItemIntervalHandler, 3000);
        window.setTimeout(updateLastItemIntervalHandler, 100);
        EventHelper.subscribe('forcePlaybackUpdate', updateLastItemIntervalHandler);

        return () => {
            window.clearInterval(intervalId);
            EventHelper.unsubscribe('forcePlaybackUpdate', updateLastItemIntervalHandler)
        };

    }, [getProfile, getLastPlaybackState]);


    return <PlaybackContext.Provider value={{
        state: getLastPlaybackState || undefined,
        item: getTrack || getEpisode || undefined,
    }}>
        {props.children}
    </PlaybackContext.Provider>
}