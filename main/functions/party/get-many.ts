import { db } from "../../../db";

export async function player_getMany(id: string) {
  return await db.query.matchPlayers.findMany({
    where: (fields, operator) => operator.eq(fields.puuid, id),
    with: {
      match: {
        with: {
          kills: {
            with: {
              assistants: true,
            },
          },
          rounds: {
            with: {
              playerStats: {
                with: {
                  damageEvents: true,
                },
              },
            },
          },
          players: true,
        },
      },
    },
  });
}

export type PopulatedPlayer = Awaited<
  ReturnType<typeof player_getMany>
>[number];
