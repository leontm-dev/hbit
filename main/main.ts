import path from "path";
import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers/create-window";
import Store from "electron-store";
import { getPrismaClient } from "./db";
import { UnofficialValorantAPI } from "uva-wrapper";
import { DefaultApiResponse } from "uva-wrapper/dist/types/response.type";
import { v4_getMatchesByName_ResponseData } from "uva-wrapper/dist/matches/v4/getMatchesByName";

const isProd = process.env.NODE_ENV === "production";

const store = new Store();

ipcMain.handle("store:get", (_, key: string) => {
  return store.get(key);
});
ipcMain.handle("store:set", (_, key: string, value: unknown) => {
  store.set(key, value);
  return true;
});
ipcMain.handle("store:delete", (_, key: string) => {
  store.delete(key);
});

const prisma = getPrismaClient();
ipcMain.handle("match:get-all", (_) => {
  return prisma.match.findMany({
    include: {
      players: true,
      kills: {
        include: { assistants: true },
      },
      rounds: {
        include: {
          playerStats: { include: { damageEvents: true } },
        },
      },
    },
  });
});
ipcMain.handle(
  "match:fetch",
  async (_, size: number = 20, start: number = 0) => {
    const key = store.get("user-key") as string | undefined;
    if (!key) return [];

    const uvaClient = new UnofficialValorantAPI(key);
    const affinity = store.get("user-affinity") as string | undefined;
    const platform = store.get("user-platform") as string | undefined;
    const name = store.get("user-name") as string | undefined;
    const tag = store.get("user-tag") as string | undefined;
    if (!affinity || !platform || !name || !tag) return [];

    try {
      const matches = await uvaClient.Matches.v4.getByName(
        affinity,
        platform,
        name,
        tag,
        "competitive",
        undefined,
        size,
        start,
      );
      if (Object.hasOwn(matches, "errors")) return [];

      const registeredMatches = await prisma.$transaction(
        (
          matches as DefaultApiResponse<v4_getMatchesByName_ResponseData[]>
        ).data.map((match) => {
          return prisma.match.create({
            data: {
              // --- MATCH METADATA ---
              id: match.metadata.match_id,
              mapId: match.metadata.map.id,
              gameLengthInMs: match.metadata.game_length_in_ms,
              startedAt: new Date(match.metadata.started_at),
              region: match.metadata.region || "",
              cluster: match.metadata.cluster,
              winningTeamId: match.teams.find((t) => t.won)?.team_id || "",
              seasonId: match.metadata.season.id,
              modeId: match.metadata.queue.id,
              platform: match.metadata.platform,
              gameVersion: match.metadata.game_version,

              // --- PLAYERS RELATION ---
              players: {
                create: match.players.map((player) => ({
                  combinedId: `${match.metadata.match_id}_${player.puuid}`,
                  puuid: player.puuid,
                  name: player.name,
                  tag: player.tag,
                  agentId: player.agent.id,
                  teamId: player.team_id,
                  tierId: player.tier.id.toString(),
                  cardId: player.customization.card,
                  titleId: player.customization.title,
                  partyId: player.party_id,
                  level: player.account_level,
                  // Pass deine API-Fields entsprechend an:
                  ability1CastCount: player.ability_casts.ability1 || 0,
                  ability2CastCount: player.ability_casts.ability2 || 0,
                  signatureCastCount: player.ability_casts.grenade || 0,
                  ultimateCastCount: player.ability_casts.ultimate || 0,
                  afkRoundsCount: player.behavior.afk_rounds,
                  friendlyFireIncoming: player.behavior.friendly_fire.incoming,
                  friendlyFireOutgoing: player.behavior.friendly_fire.outgoing,
                  roundsInSpawnCount: player.behavior.rounds_in_spawn,
                  loadoutAverage: player.economy.spent.average,
                  loadoutOverall: player.economy.spent.overall,
                  averageSpent: player.economy.spent.average,
                  overallSpent: player.economy.spent.overall,
                  sessionPlaytimeInMs: BigInt(
                    player.session_playtime_in_ms || 0,
                  ),
                  assistsCount: player.stats.assists,
                  killsCount: player.stats.kills,
                  deathsCounts: player.stats.deaths,
                  bodyShotsCount: player.stats.bodyshots,
                  headShotsCount: player.stats.headshots,
                  legShotsCount: player.stats.legshots,
                  damageDealt: player.stats.damage.dealt,
                  damageReceived: player.stats.damage.received,
                  score: player.stats.score,
                })),
              },

              // --- ROUNDS RELATION ---
              rounds: {
                create: match.rounds.map((round) => ({
                  combinedId: `${match.metadata.match_id}_${round.id}`,
                  id: round.id,
                  result: round.result,
                  ceremony: round.ceremony,
                  winningTeamId: round.winning_team,
                  planted: !!round.plant,
                  defused: !!round.defuse,

                  // Plant Events
                  plantPlayerUuid: round.plant?.player?.puuid,
                  plantPlayerTeamId: round.plant?.player?.team,
                  plantSite: round.plant?.site,
                  plantRoundTimeInMs: round.plant?.round_time_in_ms
                    ? BigInt(round.plant.round_time_in_ms)
                    : null,
                  plantX: round.plant?.location?.x,
                  planY: round.plant?.location?.y,

                  // Defuse Events
                  defusePlayerUuid: round.defuse?.player?.puuid,
                  defusePlayerTeamId: round.defuse?.player.team,
                  defuseRoundTimeInMs: round.defuse?.round_time_in_ms
                    ? BigInt(round.defuse.round_time_in_ms)
                    : null,
                  defuseX: round.defuse?.location?.x,
                  defuseY: round.defuse?.location?.y,

                  // Nested Player Stats pro Runde
                  playerStats: {
                    create: round.stats.map((stats) => ({
                      combinedId: `${match.metadata.match_id}_${round.id}_${stats.player.puuid}`,
                      puuid: stats.player.puuid,
                      teamId: stats.player.team,
                      ability1CastCount: stats.ability_casts.ability_1 || 0,
                      ability2CastCount: stats.ability_casts.ability_2 || 0,
                      signatureCastCount: stats.ability_casts.grenade || 0,
                      ultimateCastCount: stats.ability_casts.ultimate || 0,
                      score: stats.stats.score,
                      killsCount: stats.stats.kills,
                      headShotsCount: stats.stats.headshots,
                      bodyShotsCount: stats.stats.bodyshots,
                      legShotsCount: stats.stats.legshots,
                      loadoutValue: stats.economy.loadout_value,
                      remainingCredits: stats.economy.remaining,
                      weaponId: stats.economy.weapon?.id || "",
                      armorId: stats.economy.armor?.id,
                      wasAfk: stats.was_afk,
                      receivedPenalty: stats.received_penalty,
                      stayedInSpawn: stats.stayed_in_spawn,

                      // Damage Events innerhalb der Runde
                      damageEvents: {
                        create: stats.damage_events.map((dmg, dmgIdx) => ({
                          combinedId: `${match.metadata.match_id}_${round.id}_${stats.player.puuid}_dmg_${dmgIdx}`,
                          playerUuid: dmg.player.puuid,
                          playerTeamId: dmg.player.team,
                          bodyShotCount: dmg.bodyshots,
                          headShotCount: dmg.headshots,
                          legShotCount: dmg.legshots,
                          damage: dmg.damage,
                        })),
                      },
                    })),
                  },
                })),
              },

              // --- KILLS RELATION ---
              kills: {
                create: match.kills.map((kill, killIdx) => ({
                  combinedId: `${match.metadata.match_id}_kill_${killIdx}`,
                  round: kill.round,
                  killerPuuid: kill.killer.puuid,
                  killerTeamId: kill.killer.team,
                  victimPuuid: kill.victim.puuid,
                  victimTeamId: kill.victim.team,
                  x: kill.location?.x || 0,
                  y: kill.location?.y || 0,
                  secondaryFireMode: kill.secondary_fire_mode,
                  timeInMatchInMs: BigInt(kill.time_in_match_in_ms),
                  timeInRoundInMs: BigInt(kill.time_in_round_in_ms),
                  weaponId: kill.weapon?.id || "",

                  // Assistants geschachtelt
                  assistants: {
                    create: kill.assistants.map((assistant) => ({
                      combinedId: `${match.metadata.match_id}_kill_${killIdx}_ast_${assistant.puuid}`,
                      puuid: assistant.puuid,
                      teamId: assistant.team,
                    })),
                  },
                })),
              },
            },
            include: {
              players: true,
              kills: {
                include: {
                  assistants: true,
                },
              },
              rounds: {
                include: {
                  playerStats: {
                    include: {
                      damageEvents: true,
                    },
                  },
                },
              },
            },
          });
        }),
      );

      return registeredMatches;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
);

ipcMain.on("message", async (event, arg) => {
  event.reply("message", `${arg} World!`);
});

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(import.meta.dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isProd) {
    await mainWindow.loadURL("app://./");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});

app.on("before-quit", async () => {
  await prisma.$disconnect();
});
