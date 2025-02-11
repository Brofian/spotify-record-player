import {Episode, Track} from "@spotify/web-api-ts-sdk";
import {useContext} from "react";
import {PlaybackContext} from "../wrappers/PlaybackContext.tsx";

export default function PlaybackVinyl() {
    const playbackContext = useContext(PlaybackContext);
    const {state, item} = playbackContext;


    const previewImages = (item && ((item.type === 'track') ?
        (item as Track).album.images :
        (item as Episode).images
    )) || [];

    return<div
        id={'playback-vinyl'}
        className={state?.is_playing ? 'playing' : 'paused'}
    >

        <div className={'vinyl-image'}>
            {previewImages.length > 0 &&
                <img
                    src={previewImages.reduce((img, carry) => img.width > carry.width ? img : carry).url}
                    alt={'playback image'}
                />
            }
            <div className={'vinyl-hole'}></div>
        </div>

    </div>;
}