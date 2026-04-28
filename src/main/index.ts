import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { initDb, closeDb } from "./db.js";
import { log } from "./log.js";
import { bootstrap } from "./services/bootstrap.js";
import { registerWorkspaceHandlers } from "./handlers/workspace.js";
import { registerAgentHandlers } from "./handlers/agent.js";
import { registerMessageHandlers } from "./handlers/message.js";

const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 640,
    backgroundColor: "#0b0d10",
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 14, y: 14 },
    webPreferences: {
      preload: path.join(__dirname, "..", "preload", "index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(path.join(__dirname, "..", "renderer", "index.html"));
  }

  win.on("closed", () => {
    if (mainWindow === win) mainWindow = null;
  });

  return win;
}

app.whenReady().then(async () => {
  try {
    await initDb();
    await bootstrap();
    registerWorkspaceHandlers(ipcMain);
    registerAgentHandlers(ipcMain);
    registerMessageHandlers(ipcMain);
    mainWindow = createWindow();
    log.info("app.ready");
  } catch (err) {
    log.error("startup.failed", err);
    app.exit(1);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) mainWindow = createWindow();
});

app.on("before-quit", () => {
  try {
    closeDb();
  } catch (err) {
    log.warn("db.close", err);
  }
});
