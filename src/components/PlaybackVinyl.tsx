import {Track} from "@spotify/web-api-ts-sdk";
import {useContext, useEffect, useState} from "react";
import SpotifyManager from "../util/SpotifyManager.ts";
import {PlaybackContext} from "../wrappers/PlaybackContext.tsx";

export default function PlaybackVinyl() {
    const playbackState = useContext(PlaybackContext);

    console.log('rerender playback vinyl: ' + (playbackState?.item && playbackState?.item.name));

    const [getPlayingTrack, setPlayingTrack] = useState<Track | undefined>(undefined);

    useEffect(() => {
        if (playbackState && playbackState.item && (!getPlayingTrack || playbackState.item.id !== getPlayingTrack.id)) {
            const trackId = playbackState.item.id;
            SpotifyManager.sdk.tracks.get(trackId).then(setPlayingTrack);
        }
    }, [playbackState, getPlayingTrack]);

    const previewImages = getPlayingTrack?.album.images || [];


    return <div id={'playback-vinyl'} className={playbackState?.is_playing ? 'playing' : 'paused'}>

        <div className={'vinyl-image'}>
            {previewImages.length &&
                <img
                    src={previewImages.reduce((img, carry) => img.width > carry.width ? img : carry).url}
                    alt={'playback image'}
                />
            }
        </div>

    </div>;
}