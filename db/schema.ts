import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ============================================================================
// TABELLEN DEFINITIONEN
// ============================================================================

export const matches = sqliteTable("Match", {
  id: text("id").primaryKey(),
  gameLengthInMs: integer("gameLengthInMs", { mode: "number" }).notNull(), // Für BigInt in SQLite
  gameVersion: text("gameVersion").notNull(),
  mapId: text("mapId").notNull(),
  platform: text("platform").notNull(),
  modeId: text("modeId").notNull(),
  seasonId: text("seasonId").notNull(),
  cluster: text("cluster"),
  startedAt: text("startedAt").notNull(), // ISO-String Date representation in SQLite
  region: text("region").notNull(),
  winningTeamId: text("winningTeamId").notNull(),
});

export const matchRounds = sqliteTable("MatchRound", {
  combinedId: text("combinedId").primaryKey(),
  id: integer("id").notNull(),
  result: text("result").notNull(),
  ceremony: text("ceremony").notNull(),
  winningTeamId: text("winningTeamId").notNull(),

  defusePlayerUuid: text("defusePlayerUuid"),
  defusePlayerTeamId: text("defusePlayerTeamId"),
  defuseRoundTimeInMs: integer("defuseRoundTimeInMs", { mode: "number" }),
  defused: integer("defused", { mode: "boolean" }).notNull(),
  defuseX: integer("defuseX"),
  defuseY: integer("defuseY"),

  plantPlayerUuid: text("plantPlayerUuid"),
  plantPlayerTeamId: text("plantPlayerTeamId"),
  plantSite: text("plantSite"),
  planted: integer("planted", { mode: "boolean" }).notNull(),
  plantRoundTimeInMs: integer("plantRoundTimeInMs", { mode: "number" }),
  plantX: integer("plantX"),
  planY: integer("planY"), // Originaler Tippfehler aus dem Prisma-Schema beibehalten

  matchId: text("matchId")
    .notNull()
    .references(() => matches.id),
});

export const matchRoundPlayerStats = sqliteTable("MatchRoundPlayerStats", {
  combinedId: text("combinedId").primaryKey(),
  puuid: text("puuid").notNull(),
  teamId: text("teamId").notNull(),

  ability1CastCount: integer("ability1CastCount").notNull(),
  ability2CastCount: integer("ability2CastCount").notNull(),
  signatureCastCount: integer("signatureCastCount").notNull(),
  ultimateCastCount: integer("ultimateCastCount").notNull(),
  score: integer("score").notNull(),
  killsCount: integer("killsCount").notNull(),
  headShotsCount: integer("headShotsCount").notNull(),
  bodyShotsCount: integer("bodyShotsCount").notNull(),
  legShotsCount: integer("legShotsCount").notNull(),
  loadoutValue: integer("loadoutValue").notNull(),
  remainingCredits: integer("remainingCredits").notNull(),
  weaponId: text("weaponId").notNull(),
  armorId: text("armorId"),
  wasAfk: integer("wasAfk", { mode: "boolean" }).notNull(),
  receivedPenalty: integer("receivedPenalty", { mode: "boolean" }).notNull(),
  stayedInSpawn: integer("stayedInSpawn", { mode: "boolean" }).notNull(),

  matchRoundCombinedId: text("matchRoundCombinedId")
    .notNull()
    .references(() => matchRounds.combinedId),
});

export const matchRoundPlayerStatsDamageEvents = sqliteTable(
  "MatchRoundPlayerStatsDamageEvents",
  {
    combinedId: text("combinedId").primaryKey(),
    playerUuid: text("playerUuid").notNull(),
    playerTeamId: text("playerTeamId").notNull(),
    bodyShotCount: integer("bodyShotCount").notNull(),
    headShotCount: integer("headShotCount").notNull(),
    legShotCount: integer("legShotCount").notNull(),
    damage: integer("damage").notNull(),

    matchRoundPlayerStatsCombinedId: text(
      "matchRoundPlayerStatsCombinedId",
    ).references(() => matchRoundPlayerStats.combinedId),
  },
);

export const matchPlayers = sqliteTable("MatchPlayer", {
  combinedId: text("combinedId").primaryKey(),
  puuid: text("puuid").notNull(),
  name: text("name").notNull(),
  tag: text("tag").notNull(),
  ability1CastCount: integer("ability1CastCount").notNull(),
  ability2CastCount: integer("ability2CastCount").notNull(),
  signatureCastCount: integer("signatureCastCount").notNull(),
  ultimateCastCount: integer("ultimateCastCount").notNull(),
  level: integer("level").notNull(),
  agentId: text("agentId").notNull(),
  afkRoundsCount: real("afkRoundsCount").notNull(),
  friendlyFireIncoming: real("friendlyFireIncoming").notNull(),
  friendlyFireOutgoing: real("friendlyFireOutgoing").notNull(),
  roundsInSpawnCount: real("roundsInSpawnCount").notNull(),
  cardId: text("cardId").notNull(),
  titleId: text("titleId").notNull(),
  loadoutAverage: real("loadoutAverage").notNull(),
  teamId: text("teamId").notNull(),
  loadoutOverall: integer("loadoutOverall").notNull(),
  averageSpent: real("averageSpent").notNull(),
  overallSpent: integer("overallSpent").notNull(),
  partyId: text("partyId").notNull(),
  sessionPlaytimeInMs: integer("sessionPlaytimeInMs", {
    mode: "number",
  }).notNull(),
  assistsCount: integer("assistsCount").notNull(),
  killsCount: integer("killsCount").notNull(),
  deathsCounts: integer("deathsCounts").notNull(),
  bodyShotsCount: integer("bodyShotsCount").notNull(),
  headShotsCount: integer("headShotsCount").notNull(),
  legShotsCount: integer("legShotsCount").notNull(),
  damageDealt: integer("damageDealt").notNull(),
  damageReceived: integer("damageReceived").notNull(),
  score: integer("score").notNull(),
  tierId: text("tierId").notNull(),

  matchId: text("matchId")
    .notNull()
    .references(() => matches.id),
});

export const kills = sqliteTable("Kill", {
  combinedId: text("combinedId").primaryKey(),
  matchId: text("matchId")
    .notNull()
    .references(() => matches.id),

  round: integer("round").notNull(),
  killerPuuid: text("killerPuuid").notNull(),
  killerTeamId: text("killerTeamId").notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  secondaryFireMode: integer("secondaryFireMode", {
    mode: "boolean",
  }).notNull(),
  timeInMatchInMs: integer("timeInMatchInMs", { mode: "number" }).notNull(),
  timeInRoundInMs: integer("timeInRoundInMs", { mode: "number" }).notNull(),
  victimPuuid: text("victimPuuid").notNull(),
  victimTeamId: text("victimTeamId").notNull(),
  weaponId: text("weaponId").notNull(),
});

export const killAssistants = sqliteTable("KillAssistant", {
  combinedId: text("combinedId").primaryKey(),
  puuid: text("puuid").notNull(),
  teamId: text("teamId").notNull(),

  killCombinedId: text("killCombinedId")
    .notNull()
    .references(() => kills.combinedId),
});

// ============================================================================
// RELATIONS DEFINITIONEN (für Query Builder wie db.query.matches.findMany)
// ============================================================================

export const matchesRelations = relations(matches, ({ many }) => ({
  players: many(matchPlayers),
  rounds: many(matchRounds),
  kills: many(kills),
}));

export const matchRoundsRelations = relations(matchRounds, ({ one, many }) => ({
  match: one(matches, {
    fields: [matchRounds.matchId],
    references: [matches.id],
  }),
  playerStats: many(matchRoundPlayerStats),
}));

export const matchRoundPlayerStatsRelations = relations(
  matchRoundPlayerStats,
  ({ one, many }) => ({
    matchRound: one(matchRounds, {
      fields: [matchRoundPlayerStats.matchRoundCombinedId],
      references: [matchRounds.combinedId],
    }),
    damageEvents: many(matchRoundPlayerStatsDamageEvents),
  }),
);

export const matchRoundPlayerStatsDamageEventsRelations = relations(
  matchRoundPlayerStatsDamageEvents,
  ({ one }) => ({
    matchRoundPlayerStats: one(matchRoundPlayerStats, {
      fields: [
        matchRoundPlayerStatsDamageEvents.matchRoundPlayerStatsCombinedId,
      ],
      references: [matchRoundPlayerStats.combinedId],
    }),
  }),
);

export const matchPlayersRelations = relations(matchPlayers, ({ one }) => ({
  match: one(matches, {
    fields: [matchPlayers.matchId],
    references: [matches.id],
  }),
}));

export const killsRelations = relations(kills, ({ one, many }) => ({
  match: one(matches, {
    fields: [kills.matchId],
    references: [matches.id],
  }),
  assistants: many(killAssistants),
}));

export const killAssistantsRelations = relations(killAssistants, ({ one }) => ({
  kill: one(kills, {
    fields: [killAssistants.killCombinedId],
    references: [kills.combinedId],
  }),
}));

export const schema = {
  matches,
  matchRounds,
  matchPlayers,
  matchPlayersRelations,
  matchRoundPlayerStats,
  matchRoundPlayerStatsDamageEvents,
  matchRoundPlayerStatsDamageEventsRelations,
  matchRoundPlayerStatsRelations,
  matchRoundsRelations,
  matchesRelations,
  kills,
  killAssistants,
  killsRelations,
  killAssistantsRelations,
};
