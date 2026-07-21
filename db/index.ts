import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import { app } from "electron";
import { schema } from "./schema";

export function getDbPath(): string {
  if (!app.isPackaged) {
    return path.join(process.cwd(), "local.db");
  }
  return path.join(app.getPath("userData"), "app.db");
}

const sqlite = new Database(getDbPath());
export const db = drizzle(sqlite, { schema });
