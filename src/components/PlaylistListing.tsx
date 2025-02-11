import {SimplifiedPlaylist} from "@spotify/web-api-ts-sdk";
import {useCallback, useContext, useEffect, useState} from "react";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import ContextMenu from "../elements/ContextMenu.tsx";
import DropdownSelect from "../elements/DropdownSelect.tsx";
import ConfigHelper from "../util/ConfigHelper.ts";
import EventHelper from "../util/EventHelper.ts";
import SpotifyManager from "../util/SpotifyManager.ts";
import {PlaybackContext} from "../wrappers/PlaybackContext.tsx";

export default function PlaylistListing() {
    const playbackContext = useContext(PlaybackContext)
    const [getPlaylists, setPlaylists] = useState<SimplifiedPlaylist[]>([]);
    const [getIgnoredPlaylistIds, setIgnoredPlaylistsIds] = useState<string[]>([]);
    const [getFilterMode, setFilterMode] = useState<'default'|'all'>('default');
    const [getContextRef, setContextRef] = useState<{anchor: {x: number, y: number}, id: string}|undefined>(undefined);

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

    const toggleIgnoredPlaylistId = useCallback((playlistId: string, shouldAdd: boolean) => {
        const ignoredPlaylists = new Set(ConfigHelper.get('ignoredPlaylistIds'));
        if (shouldAdd)  ignoredPlaylists.add(playlistId);
        else            ignoredPlaylists.delete(playlistId);
        ConfigHelper.set('ignoredPlaylistIds', [...ignoredPlaylists]);
        setContextRef(undefined);
    }, []);


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

        {filteredPlaylists.map(playlist => {
            const isHidden = getFilterMode === 'all' && getIgnoredPlaylistIds.includes(playlist.id);

            const isCurrentlyPlaying = playbackContext.state?.context?.uri === playlist.uri;

            return (
                <div className={`playlist-item ${isHidden ? 'hidden' : ''}`}
                     key={playlist.id}
                     onContextMenu={(event) => setContextRef({
                         id: playlist.id,
                         anchor: {x: event.clientX, y: event.clientY},
                     })}
                     onClick={() => {
                         const device = playbackContext.state?.device;
                         const deviceId = device && device.id;
                         if (deviceId) {
                             SpotifyManager.sdk.player.startResumePlayback(deviceId,playlist.uri).then(() => {
                                window.setTimeout(() => EventHelper.notify('forcePlaybackUpdate', undefined), 500);
                             });
                         }
                     }}
                >

                    <div className={'playlist-item-image'}>
                        <img
                            src={playlist.images[0].url}
                            alt={`Playlist Image - ${playlist.name}`}
                        />
                    </div>

                    <div className={`playlist-item-description ${isCurrentlyPlaying ? 'is-playing' : ''}`}>
                        <div className={'playlist-item-name'}>
                            {playlist.name}
                        </div>
                        <div className={'playlist-item-info'}>
                            {playlist.tracks?.total} elements
                        </div>
                    </div>

                    {getContextRef && getContextRef.id === playlist.id &&
                        <ContextMenu
                            closeCallback={() => setContextRef(undefined)}
                            anchor={getContextRef.anchor}
                        >
                            <div
                                className={'context-menu-button'}
                                onClick={toggleIgnoredPlaylistId.bind(undefined, playlist.id, !isHidden)}
                            >
                                {isHidden ? <FaEye /> : <FaEyeSlash />}
                                {isHidden ? 'Reveal playlist' : 'Hide playlist'}
                            </div>
                        </ContextMenu>
                    }

                </div>
            );
        })}

    </div>
}