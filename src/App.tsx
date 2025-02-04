import "./App.css";
import {useEffect, useState} from "react";
import Header from "./components/Header.tsx";
import LoginCover from "./components/LoginCover.tsx";
import PlaybackVinyl from "./components/PlaybackVinyl.tsx";
import SpotifyManager from "./util/SpotifyManager.ts";
import PlaybackContextWrapper from "./wrappers/PlaybackContextWrapper.tsx";

function App() {
    const [isAuthenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            SpotifyManager.sdk.authenticate().then(() => {
                setTimeout(() => {
                    setAuthenticated(true)
                }, 1000);
            })
        }
    }, [isAuthenticated]);


    return (
        <PlaybackContextWrapper>
            <div className={'layout-container container-left ' + (isAuthenticated ? 'show' : '')}>


            </div>

            <div className={'layout-container container-center ' + (isAuthenticated ? 'show' : '')}>
                <Header/>
                <PlaybackVinyl/>
                <LoginCover authenticated={isAuthenticated}/>
            </div>

            <div className={'layout-container container-right ' + (isAuthenticated ? 'show' : '')}>

            </div>
        </PlaybackContextWrapper>
    )
}

export default App