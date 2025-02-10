import * as fs from "node:fs";
import {ipcMain} from 'electron';
import path from "node:path";

type AllowedConfigDataType = string|number|boolean|object;

export default class Config {

    private readonly configFilePath: string;
    private config: {[key: string]: AllowedConfigDataType} = {};
    private configPersistTimeout: number|undefined = undefined;
    private readonly persistTimeout: number = 500;
    private hasSetupIPC: boolean = false;

    constructor(private readonly app: Electron.App) {
        this.configFilePath = path.join(this.app.getPath("userData"), "config.json");
        this.load();
        console.log(`[INFO] Loaded configuration from ${this.configFilePath}`);
    }

    private load(): void {
        if (fs.existsSync(this.configFilePath)) {
            const configString = fs.readFileSync(this.configFilePath).toString() || '{}';
            this.config = JSON.parse(configString);
        }
        else {
            fs.writeFileSync(this.configFilePath, JSON.stringify(this.config));
        }
    }

    private persist(): void {
        const userData = JSON.stringify(this.config);
        fs.writeFileSync(this.configFilePath, userData);
    }

    private schedulePersist(): void {
        if (this.configPersistTimeout !== undefined) {
            clearTimeout(this.configPersistTimeout);
        }
        this.configPersistTimeout = Number(setTimeout(
            this.persist.bind(this),
            this.persistTimeout
        ));
    }

    public setupIPCBridge(): void {
        if (this.hasSetupIPC) return;
        this.hasSetupIPC = true;

        // listen to the set-config event, coming from the renderer
        ipcMain.on('config:set', (_event, configKey: string, configValue: AllowedConfigDataType) => {
            this.set(configKey, configValue);
        });
        // answer invocations of the getAll channel with the complete config object
        ipcMain.handle('config:getAll', () => {
            return JSON.stringify(this.getAll());
        });
    }

    public set(key: string, value: AllowedConfigDataType): void {
        this.config[key] = value;
        this.schedulePersist();
    }

    public getAll(): object {
        return this.config;
    }
}