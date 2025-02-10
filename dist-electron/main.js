var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { ipcMain, app, BrowserWindow, protocol } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as fs from "node:fs";
class Config {
  constructor(app2) {
    __publicField(this, "configFilePath");
    __publicField(this, "config", {});
    __publicField(this, "configPersistTimeout");
    __publicField(this, "persistTimeout", 500);
    __publicField(this, "hasSetupIPC", false);
    this.app = app2;
    this.configFilePath = path.join(this.app.getPath("userData"), "config.json");
    this.load();
    console.log(`[INFO] Loaded configuration from ${this.configFilePath}`);
  }
  load() {
    if (fs.existsSync(this.configFilePath)) {
      const configString = fs.readFileSync(this.configFilePath).toString() || "{}";
      this.config = JSON.parse(configString);
    } else {
      fs.writeFileSync(this.configFilePath, JSON.stringify(this.config));
    }
  }
  persist() {
    const userData = JSON.stringify(this.config);
    fs.writeFileSync(this.configFilePath, userData);
  }
  schedulePersist() {
    if (this.configPersistTimeout !== void 0) {
      clearTimeout(this.configPersistTimeout);
    }
    this.configPersistTimeout = Number(setTimeout(
      this.persist.bind(this),
      this.persistTimeout
    ));
  }
  setupIPCBridge() {
    if (this.hasSetupIPC) return;
    this.hasSetupIPC = true;
    ipcMain.on("config:set", (_event, configKey, configValue) => {
      this.set(configKey, configValue);
    });
    ipcMain.handle("config:getAll", () => {
      return JSON.stringify(this.getAll());
    });
  }
  set(key, value) {
    this.config[key] = value;
    this.schedulePersist();
  }
  getAll() {
    return this.config;
  }
}
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
const configuration = new Config(app);
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    },
    width: 1400,
    height: 1200
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  protocol.handle("spauth", async (request) => {
    console.log("spauth protocol: ", request.url);
    const query = request.url.slice("spauth://success/".length);
    const targetUrl = VITE_DEV_SERVER_URL ? VITE_DEV_SERVER_URL : path.join(RENDERER_DIST, "index.html");
    return Response.redirect(targetUrl + query);
  });
}).then(configuration.setupIPCBridge.bind(configuration)).then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
