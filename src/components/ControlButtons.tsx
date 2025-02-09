import {useCallback, useContext, useState} from "react";
import {FaBackward, FaForward, FaPause, FaPlay} from 'react-icons/fa';
import spotifyManager from "../util/SpotifyManager.ts";
import SpotifyManager from "../util/SpotifyManager.ts";
import {PlaybackContext} from "../wrappers/PlaybackContext.tsx";

export default function ControlButtons() {
    const playbackContext = useContext(PlaybackContext);
    const [isFetching, setFetching] = useState(false);

    const onButtonPressed = useCallback(async (btn: 'play'|'prev'|'next') => {
        const activeDeviceId = playbackContext.state?.device.id;
        if (!activeDeviceId || isFetching) {
            return;
        }

        setFetching(true);
        try {
            switch (btn) {
                case "play":
                    if (playbackContext.state?.is_playing) {
                        await SpotifyManager.sdk.player.pausePlayback(activeDeviceId);
                    } else {
                        await SpotifyManager.sdk.player.startResumePlayback(activeDeviceId);
                    }
                    break;
                case 'prev':
                    await spotifyManager.sdk.player.skipToPrevious(activeDeviceId);
                    break;
                case 'next':
                    await spotifyManager.sdk.player.skipToNext(activeDeviceId);
                    break;
            }
        }
        catch (err) {
            console.warn("Spotify SDK will parse return values, even if the response is defined as empty, so an error was ignored here");
            // console.error(err);
        }
        setFetching(false);

        window.setTimeout(() => window.dispatchEvent(new Event('force-context-update')), 100);
    }, [playbackContext, isFetching]);


    return <div id={'control-buttons'} className={`${isFetching ? 'is-fetching' : ''}`}>
        <div className={'button button-prev'}
             onClick={onButtonPressed.bind(undefined, 'prev')}
        >
            <FaBackward/>
        </div>

        <div className={'button button-play'}
             onClick={onButtonPressed.bind(undefined, 'play')}
        >
            {playbackContext.state?.is_playing ?
                <FaPause/> :
                <FaPlay/>
            }
        </div>

        <div className={'button button-next'}
             onClick={onButtonPressed.bind(undefined, 'next')}
        >
            <FaForward/>
        </div>

    </div>
}