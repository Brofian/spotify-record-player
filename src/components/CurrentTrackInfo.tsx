import {Episode, Track} from "@spotify/web-api-ts-sdk";
import {useContext} from "react";
import CollapseArea from "../elements/CollapseArea.tsx";
import Link from "../elements/Link.tsx";
import {PlaybackContext} from "../wrappers/PlaybackContext.tsx";

export default function CurrentTrackInfo() {
    const playbackContext = useContext(PlaybackContext);

    const item = playbackContext.item;

    if (!item) {
        return undefined;
    }

    return (
        <div id={'current-track-info'}>

            Currently playing:
            <br/>
            <Link element={item}>{item.name}</Link>
            <br/>

            <CollapseArea>

                {item.type === 'track' && <AdditionalTrackInfo track={item as Track}/>}
                {item.type === 'episode' && <AdditionalEpisodeInfo episode={item as Episode}/>}

            </CollapseArea>

        </div>
    );
}


function AdditionalTrackInfo(props: { track: Track }) {

    return (<>
        Artist{props.track.artists.length > 1 ? 's' : ''}: <br/>
        <ul>
            {props.track.artists.map(artist =>
                <li key={artist.id}>
                    <Link element={artist}>{artist.name}</Link>
                </li>
            )}
        </ul>

        Album: <br/>
        <Link element={props.track.album}>{props.track.album.name}</Link>
        <br/>

        {props.track.is_local ? <>locally stores <br/></> : ''}
    </>);
}

function AdditionalEpisodeInfo(props: { episode: Episode }) {

    return (<>
        Show: <br/>
        <Link element={props.episode.show}>{props.episode.show.name}</Link>
        <br/>

        Language: <br/>
        {props.episode.language}
        <br/>

        Description: <br/>
        {props.episode.description}
        <br/>

    </>);
}