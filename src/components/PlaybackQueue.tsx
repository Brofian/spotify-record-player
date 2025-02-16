import {Episode, Queue, Track} from "@spotify/web-api-ts-sdk";
import {useCallback, useContext, useEffect, useState} from "react";
import CollapseArea from "../elements/CollapseArea.tsx";
import useUpdateTimeout from "../hooks/useUpdateTimeout.ts";
import EventHelper from "../util/EventHelper.ts";
import SpotifyManager from "../util/SpotifyManager.ts";
import {PlaybackContext} from "../wrappers/PlaybackContext.tsx";

export default function PlaybackQueue() {
    const playbackContext = useContext(PlaybackContext);
    const [getQueue, setQueue] = useState<Queue | null>(null);
    const [isFetching, setUpdateTimeout] = useUpdateTimeout();

    useEffect(() => {
        SpotifyManager.sdk.player.getUsersQueue().then(setQueue)
    }, [playbackContext.item?.id]);

    const onQueueElementClick = useCallback(async (element: Track|Episode) => {
        const deviceId = playbackContext.state?.device.id;
        if (!deviceId) {
            return;
        }

        const contextUri = playbackContext.state?.context?.uri;
        setUpdateTimeout(1);
        if (contextUri) {
            await SpotifyManager.sdk.player.startResumePlayback(deviceId, contextUri, undefined, {
                uri: element.uri
            });
        }
        else {
            await SpotifyManager.sdk.player.startResumePlayback(deviceId, undefined, [element.uri]);
        }

        setTimeout(async () => {
            await SpotifyManager.sdk.player.getUsersQueue().then(setQueue);
            EventHelper.notify('forcePlaybackUpdate', undefined);
        }, 1000);
    }, [playbackContext, setUpdateTimeout]);

    if (playbackContext.item === undefined) {
        return undefined;
    }

    const numFixedElements = 3;
    const numOptionalElements = 7;

    const fixedPreview = getQueue?.queue.slice(1,1+numFixedElements) || [];
    const optionalPreview = getQueue?.queue.slice(1+numFixedElements,1+numFixedElements+numOptionalElements) || [];

    return (
        <div id={'playback-queue'} className={`${isFetching ? 'is-fetching' : ''}`}>

            Queue:
            <br />

            <div id={'playback-queue-wrapper'}>
                {fixedPreview.map(queueElement =>
                    <QueueElement
                        key={queueElement.id}
                        element={queueElement}
                        onClick={onQueueElementClick}
                        isFetching={isFetching}
                    />
                )}

                {optionalPreview.length > 0 &&
                    <CollapseArea>
                        {optionalPreview.map(queueElement =>
                            <QueueElement
                                key={queueElement.id}
                                element={queueElement}
                                onClick={onQueueElementClick}
                                isFetching={isFetching}
                            />
                        )}
                    </CollapseArea>
                }

            </div>

        </div>
    );
}

type ElementIProps = {
    element: Track|Episode;
    onClick: {(element: Track|Episode): void};
    isFetching: boolean;
}

function QueueElement(props: ElementIProps) {
    return (
        <div className={'queue-element'}
             onClick={props.isFetching ? undefined : () => props.onClick(props.element)}
        >
            {props.isFetching ? '...' : props.element.name}
        </div>
    );
}