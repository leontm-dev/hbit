import { count } from "drizzle-orm";
import { db } from "../../../db";
import { matches } from "../../../db/schema";

export async function db_getSize() {
  const matchCount = await db.select({ count: count() }).from(matches);

  return matchCount;
}
