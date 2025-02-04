import {UserProfile} from "@spotify/web-api-ts-sdk";
import {useEffect, useState} from "react";
import SpotifyManager from "../util/SpotifyManager.ts";

export default function Header() {
    const [getProfile, setProfile] = useState<UserProfile | undefined>(undefined);

    useEffect(() => {
        if (!getProfile) {
            SpotifyManager.sdk.currentUser.profile().then(setProfile);
        }
    }, [getProfile]);

    return <div id={'header'} className={'flex-cols'}>

        <div className={'column justify-start'}>

        </div>


        <div className={'column justify-center'}>

        </div>


        <div className={'column justify-end'}>

            <div className={'profile-name'}>
                {getProfile?.display_name}
            </div>

            <div onClick={() => {
                SpotifyManager.sdk.logOut();
                window.location.reload();
            }}>Logout</div>

        </div>

    </div>
}