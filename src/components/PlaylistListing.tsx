import {SimplifiedPlaylist} from "@spotify/web-api-ts-sdk";
import {useEffect, useState} from "react";
import SpotifyManager from "../util/SpotifyManager.ts";

export default function PlaylistListing() {
    // const playbackContext = useContext(PlaybackContext)
    const [getPlaylists, setPlaylists] = useState<SimplifiedPlaylist[]>([]);

    useEffect(() => {
        SpotifyManager.sdk.currentUser.profile().then(profile => {

            SpotifyManager.sdk.currentUser.playlists.playlists().then(page => {
                const playlists = page.items
                    .filter(p => p.owner.id === profile.id)
                    .sort((a, b) => a.name < b.name ? -1 : 1);

                setPlaylists(playlists)
            });
        });
    }, []);


    return <div id={'playlist-listing'}>

        {getPlaylists.map(playlist =>
            <div className={'playlist-item'}>
                {playlist.name}
            </div>
        )}

    </div>
}