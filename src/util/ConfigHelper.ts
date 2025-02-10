import EventHelper from "./EventHelper.ts";

export type ConfigLayout = {
    ignoredPlaylistIds: string[];
}


class ConfigHelperContainer {

    private config: ConfigLayout = {
        ignoredPlaylistIds: [],
    };
    private loadingPromise: Promise<void>|undefined = undefined;
    private readonly watchList: {[key: string]: {(event: CustomEvent): void}} = {};

    constructor() {
        this.loadingPromise = new Promise(this.reloadCompleteConfig.bind(this));
        this.loadingPromise.then(() => this.loadingPromise = undefined);
    }

    private async reloadCompleteConfig(): Promise<void> {
        const configString = await window.ipcRenderer.invoke('config:getAll');
        this.config = {...this.config, ...JSON.parse(configString)};
        console.log('loaded config from disk: ' + configString);
    }

    public onInitialize(callback: {(): void}): void {
        if (this.loadingPromise) {
            this.loadingPromise.then(callback);
        }
        callback();
    }

    public get<T extends keyof ConfigLayout>(config: T): ConfigLayout[T] {
        return this.config[config];
    }

    public set<T extends keyof ConfigLayout>(config: T, data: ConfigLayout[T]): void {
        if (this.config[config] !== data) {
            this.config[config] = data;
            EventHelper.notify('configChanged', config);
            console.log('setting config value');
            window.ipcRenderer.send('config:set', config, data);
        }
    }

    public watch<T extends keyof ConfigLayout>(config: T, listener: {(data: ConfigLayout[T]): void}): string {
        const eventListener = (event: CustomEvent<string>) => {
            if (event.detail === config) {
                listener(this.get(config))
            }
        }

        const eventId: string = window.crypto.randomUUID();
        this.watchList[eventId] = eventListener;
        EventHelper.subscribe('configChanged', eventListener);

        return eventId;
    }

    public unwatch(watchId: string): void {
        if (this.watchList[watchId]) {
            EventHelper.unsubscribe('configChanged', this.watchList[watchId]);
            delete this.watchList[watchId];
        }
    }
}

const ConfigHelper = new ConfigHelperContainer();
export default ConfigHelper;