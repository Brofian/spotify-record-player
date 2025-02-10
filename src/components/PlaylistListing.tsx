import {SimplifiedPlaylist} from "@spotify/web-api-ts-sdk";
import {useEffect, useState} from "react";
import DropdownSelect from "../elements/DropdownSelect.tsx";
import ConfigHelper from "../util/ConfigHelper.ts";
import SpotifyManager from "../util/SpotifyManager.ts";

export default function PlaylistListing() {
    // const playbackContext = useContext(PlaybackContext)
    const [getPlaylists, setPlaylists] = useState<SimplifiedPlaylist[]>([]);
    const [getIgnoredPlaylistIds, setIgnoredPlaylistsIds] = useState<string[]>([]);
    const [getFilterMode, setFilterMode] = useState<'default'|'all'>('default');

    useEffect(() => {
        SpotifyManager.sdk.currentUser.profile().then(profile => {

            SpotifyManager.sdk.currentUser.playlists.playlists().then(page => {
                const playlists = page.items
                    .filter(p => p.owner.id === profile.id)
                    .sort((a, b) => a.name < b.name ? -1 : 1);

                setPlaylists(playlists)
            });
        });

        setIgnoredPlaylistsIds(ConfigHelper.get('ignoredPlaylistIds'))
    }, []);


    useEffect(() => {
        const watchId = ConfigHelper.watch('ignoredPlaylistIds', setIgnoredPlaylistsIds);
        return () => {
            ConfigHelper.unwatch(watchId);
        }
    }, [getPlaylists]);


    const getFilteredPlaylists = (): SimplifiedPlaylist[] => {
        switch (getFilterMode) {
            case "all":
                return getPlaylists;
            case 'default':
            default:
                return getPlaylists.filter(p => !getIgnoredPlaylistIds.includes(p.id));
        }
    }

    const filteredPlaylists = getFilteredPlaylists();

    return <div id={'playlist-listing'}>

        <div className={'column-header'}>

            <DropdownSelect
                selected={getFilterMode}
                options={[
                    {value: 'default', label: 'Sichtbare'},
                    {value: 'all', label: 'Alle'},
                ]}
                onChange={(value) => setFilterMode(value)}
            />

        </div>

        {filteredPlaylists.map(playlist =>
            <div className={'playlist-item'} key={playlist.id}>
                {playlist.name}

                <span onClick={() => {
                    ConfigHelper.set('ignoredPlaylistIds', [...ConfigHelper.get('ignoredPlaylistIds'), playlist.id])
                }}>Ignore</span>
            </div>
        )}

    </div>
}