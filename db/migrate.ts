import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "./index";
import path from "path";
import { app } from "electron";

export function runMigrations() {
  try {
    const migrationsFolder = app.isPackaged
      ? path.join(process.resourcesPath, "drizzle")
      : path.join(process.cwd(), "drizzle");

    migrate(db, { migrationsFolder });
    console.log("✅ Migrations completed successfully.");
  } catch (error) {
    console.error("❌ Failed to run migrations:", error);
  }
}
