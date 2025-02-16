import "./App.css";
import {useEffect, useState} from "react";
import ControlButtons from "./components/ControlButtons.tsx";
import CurrentTrackInfo from "./components/CurrentTrackInfo.tsx";
import Header from "./components/Header.tsx";
import LoginCover from "./components/LoginCover.tsx";
import PlaybackQueue from "./components/PlaybackQueue.tsx";
import PlaybackVinyl from "./components/PlaybackVinyl.tsx";
import PlaylistListing from "./components/PlaylistListing.tsx";
import ConfigHelper from "./util/ConfigHelper.ts";
import SpotifyManager from "./util/SpotifyManager.ts";
import PlaybackContextWrapper from "./wrappers/PlaybackContextWrapper.tsx";

function App() {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [isConfigInitialized, setConfigInitialized] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            SpotifyManager.sdk.authenticate().then(() => {
                setTimeout(() => {
                    setAuthenticated(true)
                }, 1000);
            })
        }
        if (!isConfigInitialized) {
            ConfigHelper.onInitialize(() => setConfigInitialized(true));
        }
    }, [isConfigInitialized, isAuthenticated]);

    if (!isConfigInitialized) {
        return <></>;
    }

    return (
        <PlaybackContextWrapper>
            <div className={'layout-container container-left ' + (isAuthenticated ? 'show' : '')}>
                <PlaylistListing />
            </div>

            <div className={'layout-container container-center ' + (isAuthenticated ? 'show' : '')}>
                <Header/>
                <PlaybackVinyl/>
                <LoginCover authenticated={isAuthenticated}/>
            </div>

            <div className={'layout-container container-right ' + (isAuthenticated ? 'show' : '')}>
                <ControlButtons/>
                <br/>
                <CurrentTrackInfo/>
                <br/>
                <PlaybackQueue/>
            </div>
        </PlaybackContextWrapper>
    )
}

export default App