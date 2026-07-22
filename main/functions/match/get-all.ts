import { desc } from "drizzle-orm";
import { db } from "../../../db";
import { matches } from "../../../db/schema";

export async function match_getAll() {
  return db.query.matches.findMany({
    orderBy: desc(matches.startedAt),
    with: {
      players: true,
      kills: { with: { assistants: true } },
      rounds: { with: { playerStats: { with: { damageEvents: true } } } },
    },
  });
}

export type MatchPopulated = Awaited<ReturnType<typeof match_getAll>>[number];
