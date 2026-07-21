import { db } from "../../../db";

export async function match_getAll() {
  return db.query.matches.findMany({
    with: {
      players: true,
      kills: true,
      rounds: { with: { playerStats: { with: { damageEvents: true } } } },
    },
  });
}

export type MatchPopulated = Awaited<ReturnType<typeof match_getAll>>[number];
