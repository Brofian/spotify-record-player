import {Devices, UserProfile} from "@spotify/web-api-ts-sdk";
import {useCallback, useContext, useEffect, useState} from "react";
import {HiOutlineLogout} from "react-icons/hi";
import ContextMenu, {AnchorPosition} from "../elements/ContextMenu.tsx";
import DropdownSelect from "../elements/DropdownSelect.tsx";
import EventHelper from "../util/EventHelper.ts";
import SpotifyManager from "../util/SpotifyManager.ts";
import {PlaybackContext} from "../wrappers/PlaybackContext.tsx";
import {localPlayerName} from "./LocalPlayer.tsx";

export default function Header() {
    const playbackContext = useContext(PlaybackContext);
    const [getProfile, setProfile] = useState<UserProfile | undefined>(undefined);
    const [getAvailableDevices, setAvailableDevices] = useState<Devices | undefined>(undefined);
    const [showLogout, setShowLogout] = useState<AnchorPosition|undefined>(undefined);

    useEffect(() => {
        if (!getProfile) {
            SpotifyManager.sdk.currentUser.profile().then(setProfile);
        }
    }, [getProfile]);

    const updateAvailableDevices = useCallback(() => {
        SpotifyManager.sdk.player.getAvailableDevices().then(setAvailableDevices);
    }, [setAvailableDevices]);


    const devices = getAvailableDevices?.devices || [];
    // ensure, the active device is set
    const activeDevice = playbackContext.state?.device;
    if (activeDevice && !devices.find(d => d.id === activeDevice.id)) {
        devices.unshift(activeDevice);
    }


    return <div id={'header'} className={'flex-cols'}>

        <div className={'column justify-start'}>

            <div className={'device-info'}>

                <DropdownSelect
                    options={
                        devices.map(device => {
                            return {
                                value: device.id || '???',
                                label: `${(device?.name || '???')}${localPlayerName === device.name ? ' (this window)' : ''}`
                            };
                        })
                    }
                    selected={activeDevice?.id || '???'}
                    onChange={async (value) => {
                        if (value !== activeDevice?.id) {
                            await SpotifyManager.sdk.player.transferPlayback([value]);
                            setTimeout(() => EventHelper.notify('forcePlaybackUpdate', undefined), 500);
                        }
                    }}
                    onOpen={updateAvailableDevices}
                />
            </div>

        </div>


        <div className={'column justify-center'}>

            {/* <LocalPlayer /> */}

        </div>


        <div className={'column justify-end'}>

            <ProfileInfo
                getProfile={getProfile}
                setShowLogout={setShowLogout}
                showLogout={showLogout}
            />

        </div>

    </div>
}

type ProfileIProps = {
    setShowLogout: {(anchor: AnchorPosition|undefined): void},
    showLogout: AnchorPosition|undefined,
    getProfile: UserProfile|undefined,
}

function ProfileInfo(props: ProfileIProps) {
    const {setShowLogout, showLogout, getProfile} = props;

    return (
        <div className={'profile-info'} onClick={(event) => {
            setShowLogout({x: event.clientX, y: event.clientY});
        }}>
            <div className={'profile-name'}>
                {getProfile?.display_name}
            </div>

            <div className={'profile-image'}>
                {(getProfile?.images.length || 0) > 0 ?
                    <img
                        src={getProfile?.images[0].url}
                        alt={`${getProfile?.display_name}'s profile picture`}
                    />
                    :
                    <div className={'fake-profile-image'}>{getProfile?.display_name.charAt(0)}</div>
                }
            </div>

            {showLogout &&
                <ContextMenu closeCallback={setShowLogout.bind(undefined, undefined)} anchor={showLogout}>
                    <div className={'context-menu-button'}
                         onClick={() => {
                             SpotifyManager.sdk.logOut();
                             window.location.reload();
                         }}>
                        <HiOutlineLogout />
                        Logout
                    </div>
                </ContextMenu>
            }
        </div>
    );
}