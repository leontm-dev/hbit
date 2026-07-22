import { db } from "../../../db";

export async function match_getOne(id: string) {
  return (
    (
      await db.query.matches.findMany({
        where: (fields, operator) => operator.eq(fields.id, id),
        with: {
          kills: {
            with: {
              assistants: true,
            },
          },
          players: true,
          rounds: {
            with: {
              playerStats: {
                with: {
                  damageEvents: true,
                },
              },
            },
          },
        },
      })
    )?.[0] || null
  );
}
