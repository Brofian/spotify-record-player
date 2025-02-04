import {UserProfile} from "@spotify/web-api-ts-sdk";
import {useContext, useEffect, useState} from "react";
import SpotifyManager from "../util/SpotifyManager.ts";
import {PlaybackContext} from "../wrappers/PlaybackContext.tsx";

export default function Header() {
    const playbackContext = useContext(PlaybackContext);
    const [getProfile, setProfile] = useState<UserProfile | undefined>(undefined);

    useEffect(() => {
        if (!getProfile) {
            SpotifyManager.sdk.currentUser.profile().then(setProfile);
        }
    }, [getProfile]);

    return <div id={'header'} className={'flex-cols'}>

        <div className={'column justify-start'}>

            { playbackContext.state?.device &&
                `Device: ${playbackContext.state?.device.name}`
            }

        </div>


        <div className={'column justify-center'}>

        </div>


        <div className={'column justify-end'}>

            <div className={'profile-name'}>
                {getProfile?.display_name}
            </div>

            <div className={'profile-image'}>
                {(getProfile?.images.length || 0) > 0 ?
                    <img
                        src={getProfile?.images[0].url}
                        alt={`${getProfile?.display_name}'s profile picture`}
                    />
                    :
                    <div className={'fake-profile-image'}>{getProfile?.display_name.charAt(0)}</div>
                }
            </div>

            <div onClick={() => {
                SpotifyManager.sdk.logOut();
                window.location.reload();
            }}>Logout</div>

        </div>

    </div>
}