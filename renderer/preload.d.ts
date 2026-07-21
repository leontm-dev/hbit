import { DB, IpcHandler, StoreApi, UVA } from "../main/preload";

declare global {
  interface Window {
    ipc: IpcHandler;
    store: StoreApi;
    db: DB;
    uva: UVA;
  }
}
