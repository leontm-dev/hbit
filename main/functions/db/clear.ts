import { db } from "../../../db";
import { matches } from "../../../db/schema";

export async function db_clear() {
  return db.delete(matches);
}
