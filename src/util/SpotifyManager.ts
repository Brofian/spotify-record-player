import {SpotifyApi} from "@spotify/web-api-ts-sdk";

class SpotifyManagerContainer {

    public readonly sdk: SpotifyApi = SpotifyApi.withUserAuthorization(
        import.meta.env.VITE_CLIENT_ID,
        "spauth://success",
        [
            "user-read-private",
            "user-read-email",
            "user-read-playback-state",
            "user-modify-playback-state",
            "playlist-read-private",
            "playlist-modify-public",
            "playlist-modify-private",
        ],
    );


}

const SpotifyManager = new SpotifyManagerContainer();
export default SpotifyManager;