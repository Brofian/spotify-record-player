import {useCallback, useContext} from "react";
import {FaBackward, FaForward, FaPause, FaPlay} from 'react-icons/fa';
import {FaRepeat, FaShuffle} from "react-icons/fa6";
import useUpdateTimeout from "../hooks/useUpdateTimeout.ts";
import EventHelper from "../util/EventHelper.ts";
import spotifyManager from "../util/SpotifyManager.ts";
import SpotifyManager from "../util/SpotifyManager.ts";
import {PlaybackContext} from "../wrappers/PlaybackContext.tsx";

type RepeatState = 'off'|'track'|'context';
const repeatMap: {[key: string]: RepeatState} = {
    off: 'context',
    context: 'track',
    track: 'off',
}


export default function ControlButtons() {
    const playbackContext = useContext(PlaybackContext);
    const [isFetching, setUpdateTimeout] = useUpdateTimeout();

    const onButtonPressed = useCallback(async (btn: 'play'|'prev'|'next'|'shuffle'|'repeat') => {
        const activeDeviceId = playbackContext.state?.device.id;
        if (!activeDeviceId || isFetching) {
            return;
        }

        setUpdateTimeout(1);
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
                case 'shuffle':
                    console.log('setting shuffle to: ', !playbackContext.state?.shuffle_state);
                    await spotifyManager.sdk.player.togglePlaybackShuffle(!playbackContext.state?.shuffle_state, activeDeviceId);
                    break;
                case 'repeat':
                    await spotifyManager.sdk.player.setRepeatMode(
                        repeatMap[playbackContext.state?.repeat_state as RepeatState || 'off'],
                        activeDeviceId);
                    break;
            }
        }
        catch (err) {
            console.warn("Spotify SDK will parse return values, even if the response is defined as empty, so an error was ignored here");
            // console.error(err);
        }

        window.setTimeout(() => EventHelper.notify('forcePlaybackUpdate', undefined), 500);
    }, [playbackContext, isFetching, setUpdateTimeout]);


    return <div id={'control-buttons'} className={`${isFetching ? 'is-fetching' : ''}`}>

        <div className={'control-row'}>
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

        <div className={'control-row'}>
            <div className={`button button-shuffle ${playbackContext.state?.shuffle_state ? 'is-shuffle' : ''}`}
                 onClick={onButtonPressed.bind(undefined, 'shuffle')}
            >
                <FaShuffle/>
            </div>

            <div className={`button button-repeat is-repeat-${playbackContext.state?.repeat_state || 'off'}`}
                 onClick={onButtonPressed.bind(undefined, 'repeat')}
            >
                <FaRepeat/>
            </div>
        </div>

    </div>
}