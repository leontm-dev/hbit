import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import type { Prisma } from "./generated/prisma/client";

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
  match: {
    getAll: () =>
      ipcRenderer.invoke("match:get-all") as Promise<
        Prisma.MatchGetPayload<{
          include: {
            kills: { include: { assistants: true } };
            rounds: {
              include: {
                playerStats: {
                  include: { damageEvents: true };
                };
              };
            };
            players: true;
          };
        }>[]
      >,
    fetch: (size?: number, start?: number) =>
      ipcRenderer.invoke("match:fetch", size, start) as Promise<
        Prisma.MatchGetPayload<{
          include: {
            kills: { include: { assistants: true } };
            rounds: {
              include: {
                playerStats: {
                  include: { damageEvents: true };
                };
              };
            };
            players: true;
          };
        }>[]
      >,
  },
};

contextBridge.exposeInMainWorld("db", dbApi);

export type IpcHandler = typeof handler;
export type StoreApi = typeof storeApi;
export type DB = typeof dbApi;
