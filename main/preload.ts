import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

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
export type IpcHandler = typeof handler;
export type StoreApi = typeof storeApi;
