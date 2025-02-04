import LoginCoverImage from "../assets/cover.png?url";


export default function LoginCover(props: {authenticated: boolean}) {

    return <div id='login-cover' className={props.authenticated ? 'slide-out' : undefined}>
        <img
            className={'cover-bg'}
            src={LoginCoverImage}
            alt={"Login Cover"}
        />

        <div className={'login-form'}>

            <div>Spotify Controller</div>

        </div>

    </div>;
}