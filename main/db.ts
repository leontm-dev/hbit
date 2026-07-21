// electron/db.ts
import { PrismaClient } from "./generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";
import { app } from "electron";
import path from "path";

let prisma: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    // Pfad zum OS-spezifischen Datenordner (%APPDATA%/deine-app/app.db)
    const dbPath = path.join(app.getPath("userData"), "app.db");

    // 1. Instanziiere den nativen SQLite-Treiber
    const sqlite = new Database(dbPath);
    sqlite.pragma("journal_mode = WAL"); // Performance-Optimierung

    // 2. Erstelle den Prisma 7 Driver Adapter
    const adapter = new PrismaBetterSqlite3({ url: dbPath });

    // 3. Prisma Client mit dem Driver Adapter initialisieren
    prisma = new PrismaClient({ adapter });
  }

  return prisma as PrismaClient;
}
