import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { MatchPopulated } from "./functions/match/get-all";
import { DefaultApiResponse } from "uva-wrapper/dist/types/response.type";
import { v2_getAccount_ResponseData } from "uva-wrapper/dist/account/v2/getAccount";
import { PopulatedPlayer } from "./functions/party/get-many";

console.log("Working");

const handler = {
  send<T>(channel: string, value?: T) {
    ipcRenderer.send(channel, value);
  },
  on<T>(channel: string, callback: (...args: T[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: T[]) =>
      callback(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
};

contextBridge.exposeInMainWorld("ipc", handler);

const storeApi = {
  get: (key: string) => ipcRenderer.invoke("store:get", key),
  set: (key: string, value: unknown) =>
    ipcRenderer.invoke("store:set", key, value),
  delete: (key: string) => ipcRenderer.invoke("store:delete", key),
};

contextBridge.exposeInMainWorld("store", storeApi);

const dbApi = {
  match_getAll: () =>
    ipcRenderer.invoke("db:match:get-all") as Promise<MatchPopulated[]>,
  match_fetch: (size?: number, start?: number) =>
    ipcRenderer.invoke("db:match:fetch", size, start) as Promise<
      MatchPopulated[]
    >,
  match_count: () => ipcRenderer.invoke("db:match:count") as Promise<number>,
  match_clear: () => ipcRenderer.invoke("db:match:clear") as Promise<void>,
  match_getOne: (id: string) =>
    ipcRenderer.invoke("db:match:get-one", id) as Promise<MatchPopulated>,
  player_getMany: (id: string) =>
    ipcRenderer.invoke("db:player:get-many", id) as Promise<PopulatedPlayer>,
};

contextBridge.exposeInMainWorld("db", dbApi);

const uva = {
  checkPlayer: (name: string, tag: string) =>
    ipcRenderer.invoke(
      "uva:check-player",
      name,
      tag,
    ) as Promise<DefaultApiResponse<v2_getAccount_ResponseData> | null>,
};

contextBridge.exposeInMainWorld("uva", uva);

export type IpcHandler = typeof handler;
export type StoreApi = typeof storeApi;
export type DB = typeof dbApi;
export type UVA = typeof uva;
