import {PlaybackState} from "@spotify/web-api-ts-sdk";
import {createContext} from "react";

export const PlaybackContext = createContext<PlaybackState | undefined>(undefined);