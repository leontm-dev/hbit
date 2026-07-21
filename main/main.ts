import path from "path";
import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers/create-window";
import Store from "electron-store";
import { runMigrations } from "../db/migrate";
import { match_getAll } from "./functions/match/get-all";
import { match_fetch } from "./functions/match/fetch";
import { api_checkPlayer } from "./functions/api/check-player";
import { db_getSize } from "./functions/db/get-size";
import { db_clear } from "./functions/db/clear";

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  runMigrations();
  const store = new Store();

  ipcMain.handle("store:get", (_, key: string) => {
    return store.get(key);
  });
  ipcMain.handle("store:set", (_, key: string, value: unknown) => {
    store.set(key, value);
    return true;
  });
  ipcMain.handle("store:delete", (_, key: string) => {
    store.delete(key);
  });

  ipcMain.handle("db:match:get-all", async (_) => {
    return await match_getAll();
  });
  ipcMain.handle(
    "db:match:fetch",
    async (_, size: number = 10, start: number = 0) => {
      const key = (await store.get("user-key")) as string | undefined;
      const platform = (await store.get("user-platform")) as string | undefined;
      const affinity = (await store.get("user-affinity")) as string | undefined;
      const name = (await store.get("user-name")) as string | undefined;
      const tag = (await store.get("user-tag")) as string | undefined;
      if (!key || !platform || !affinity || !name || !tag) {
        console.log(key, platform, affinity, name, tag);
        return [];
      }

      return await match_fetch(key, affinity, platform, name, tag, size, start);
    },
  );
  ipcMain.handle("db:match:count", async (_) => {
    return await db_getSize();
  });
  ipcMain.handle("db:match:clear", async (_) => {
    return await db_clear();
  });
  ipcMain.handle("uva:check-player", async (_, name: string, tag: string) => {
    const key = (await store.get("user-key")) as string | undefined;
    if (!key) return null;

    return await api_checkPlayer(key, name, tag);
  });

  const preloadPath = isProd
    ? path.join(app.getAppPath(), "app", "preload.js")
    : path.join(app.getAppPath(), "app", "preload.js");
  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: preloadPath,
    },
  });

  if (isProd) {
    await mainWindow.loadURL("app://./");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
