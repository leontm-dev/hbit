import { DB, IpcHandler, StoreApi } from "../main/preload";

declare global {
  interface Window {
    ipc: IpcHandler;
    store: StoreApi;
    db: DB;
  }
}
