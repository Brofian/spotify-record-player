import {Page, SimplifiedPlaylist, SpotifyApi} from "@spotify/web-api-ts-sdk";

class SpotifyManagerContainer {

    private readonly sdk: SpotifyApi = SpotifyApi.withUserAuthorization(
        import.meta.env.VITE_CLIENT_ID,
        "spauth://success",
        [
            "user-read-private",
            "user-read-email",
            "playlist-read-private",
            "playlist-modify-public",
            "playlist-modify-private",
        ],
    );

    public async getPlaylists(): Promise<Page<SimplifiedPlaylist>> {
        return await this.sdk.currentUser.playlists.playlists(50);
    }

}

const SpotifyManager = new SpotifyManagerContainer();
export default SpotifyManager;