import {memo, useEffect, useState} from "react";
import SpotifyManager from "../util/SpotifyManager.ts";
import SpotifyPlayer from "../util/SpotifyPlayer.ts";

const spotifyPlayerScriptId = 'spotify-player-script';

export const localPlayerName = 'Desktop Spotify Controller'

const LocalPlayer = memo(() => {
    const [getPlayer, setPlayer] = useState<SpotifyPlayer|null>(null);

    useEffect(() => {

        if (!document.getElementById(spotifyPlayerScriptId)) {
            const script = document.createElement("script");
            script.id = spotifyPlayerScriptId;
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;
            document.body.appendChild(script);
        }

        window.onSpotifyWebPlaybackSDKReady = async () => {
            const token = await SpotifyManager.sdk.getAccessToken();
            if (!token) {
                return;
            }


            const player = new window.Spotify.Player({
                name: localPlayerName,
                getOAuthToken: (cb: {(token: string): void}) => { cb(token.access_token); },
                volume: 1.0
            });

            setPlayer(player);

            player.addListener('ready', (args: {device_id: string}) => {
                console.log('Ready with Device ID', args.device_id);
            });

            player.addListener('not_ready', (args: {device_id: string}) => {
                console.log('Device ID has gone offline', args.device_id);
            });

            player.connect();
        };
    }, []);

    console.log(getPlayer);

    return (<div>{getPlayer ? 'active' : 'inactive'}</div>);
});

export default LocalPlayer;