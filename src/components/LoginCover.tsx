import LoginCoverImage from "../assets/cover.png?url";
import SpotifyManager from "../util/SpotifyManager.ts";

export default function LoginCover() {


    const loginCallback = () => {

        SpotifyManager.getPlaylists().then(result => console.log(result));



    };

    return <div id='login-cover'>
        <img
            className={'cover-bg'}
            src={LoginCoverImage}
            alt={"Login Cover"}
        />

        <div className={'login-form'}>

            <h2>Spotify Login</h2>

            <button
                onClick={loginCallback}
            >
                Login
            </button>

        </div>

    </div>;
}