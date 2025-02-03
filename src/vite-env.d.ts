/// <reference types="vite/client" />

declare module "*?*" {
    const src: string;
    export default src;
}

interface ImportMetaEnv {
    readonly VITE_CLIENT_ID: string
    // more env variables...
}