export default interface SpotifyPlayer {

    readonly isLoaded: Promise<undefined>;

    readonly _options: {
        getOAuthToken: {(cb: {accessToken: string}): string}
        name: string;
        volume: number;
    }

}