import {useContext} from "react";
import {PlaybackContext} from "../wrappers/PlaybackContext.tsx";

export default function PlaybackVinyl() {
    const playbackContext = useContext(PlaybackContext);
    const {state, track} = playbackContext;

    console.log('rerender playback vinyl: ' + (state?.item && state?.item.name));

    const previewImages = track?.album.images || [];

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