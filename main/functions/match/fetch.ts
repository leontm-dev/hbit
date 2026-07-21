import { DefaultApiResponse } from "uva-wrapper/dist/types/response.type";
import { UnofficialValorantAPI } from "uva-wrapper";
import { v4_getMatchesByName_ResponseData } from "uva-wrapper/dist/matches/v4/getMatchesByName";
import { db } from "../../../db";
import {
  matches,
  matchPlayers,
  matchRounds,
  matchRoundPlayerStats,
  matchRoundPlayerStatsDamageEvents,
  kills,
  killAssistants,
} from "../../../db/schema"; // Pfad zu deinem Drizzle Schema anpassen

export async function match_fetch(
  key: string,
  affinity: string,
  platform: string,
  name: string,
  tag: string,
  size: number = 20,
  start: number = 0,
) {
  try {
    const uvaClient = new UnofficialValorantAPI(key);
    const matchesRes = await fetch(
      `https://api.henrikdev.xyz/valorant/v4/matches/${affinity}/${platform}/${name}/${tag}?size=${size}&start=${start}&mode=competitive`,
      { method: "GET", headers: { Authorization: key } },
    );
    if (!matchesRes.ok) return [];

    const matchesData = (
      (await matchesRes.json()) as DefaultApiResponse<
        v4_getMatchesByName_ResponseData[]
      >
    ).data;

    const registeredMatchIds: string[] = [];

    // Führe alle Inserts in einer einzigen ACID-Transaktion aus
    db.transaction((tx) => {
      for (const match of matchesData) {
        const matchId = match.metadata.match_id;
        registeredMatchIds.push(matchId);

        // 1. MATCH INSERT
        tx.insert(matches)
          .values({
            id: matchId,
            mapId: match.metadata.map.id,
            gameLengthInMs: match.metadata.game_length_in_ms,
            startedAt: new Date(match.metadata.started_at).toISOString(),
            region: match.metadata.region || "",
            cluster: match.metadata.cluster,
            winningTeamId: match.teams.find((t) => t.won)?.team_id || "",
            seasonId: match.metadata.season.id,
            modeId: match.metadata.queue.id,
            platform: match.metadata.platform,
            gameVersion: match.metadata.game_version,
          })
          .onConflictDoNothing(); // Verhindert Fehler, falls das Match bereits existiert

        // 2. PLAYERS INSERT (Bulk Insert)
        if (match.players && match.players.length > 0) {
          const playersValues = match.players.map((player) => ({
            combinedId: `${matchId}_${player.puuid}`,
            matchId: matchId,
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
            sessionPlaytimeInMs: Number(player.session_playtime_in_ms || 0),
            assistsCount: player.stats.assists,
            killsCount: player.stats.kills,
            deathsCounts: player.stats.deaths,
            bodyShotsCount: player.stats.bodyshots,
            headShotsCount: player.stats.headshots,
            legShotsCount: player.stats.legshots,
            damageDealt: player.stats.damage.dealt,
            damageReceived: player.stats.damage.received,
            score: player.stats.score,
          }));

          tx.insert(matchPlayers).values(playersValues).onConflictDoNothing();
        }

        // 3. ROUNDS, STATS & DAMAGE EVENTS INSERT
        for (const round of match.rounds) {
          const roundCombinedId = `${matchId}_${round.id}`;

          tx.insert(matchRounds)
            .values({
              combinedId: roundCombinedId,
              matchId: matchId,
              id: round.id,
              result: round.result,
              ceremony: round.ceremony,
              winningTeamId: round.winning_team,
              planted: !!round.plant,
              defused: !!round.defuse,
              plantPlayerUuid: round.plant?.player?.puuid,
              plantPlayerTeamId: round.plant?.player?.team,
              plantSite: round.plant?.site,
              plantRoundTimeInMs: round.plant?.round_time_in_ms
                ? Number(round.plant.round_time_in_ms)
                : null,
              plantX: round.plant?.location?.x,
              planY: round.plant?.location?.y,
              defusePlayerUuid: round.defuse?.player?.puuid,
              defusePlayerTeamId: round.defuse?.player?.team,
              defuseRoundTimeInMs: round.defuse?.round_time_in_ms
                ? Number(round.defuse.round_time_in_ms)
                : null,
              defuseX: round.defuse?.location?.x,
              defuseY: round.defuse?.location?.y,
            })
            .onConflictDoNothing();

          for (const stats of round.stats) {
            const statsCombinedId = `${matchId}_${round.id}_${stats.player.puuid}`;

            tx.insert(matchRoundPlayerStats)
              .values({
                combinedId: statsCombinedId,
                matchRoundCombinedId: roundCombinedId,
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
              })
              .onConflictDoNothing();

            if (stats.damage_events && stats.damage_events.length > 0) {
              const dmgValues = stats.damage_events.map((dmg, dmgIdx) => ({
                combinedId: `${statsCombinedId}_dmg_${dmgIdx}`,
                matchRoundPlayerStatsCombinedId: statsCombinedId,
                playerUuid: dmg.player.puuid,
                playerTeamId: dmg.player.team,
                bodyShotCount: dmg.bodyshots,
                headShotCount: dmg.headshots,
                legShotCount: dmg.legshots,
                damage: dmg.damage,
              }));

              tx.insert(matchRoundPlayerStatsDamageEvents)
                .values(dmgValues)
                .onConflictDoNothing();
            }
          }
        }

        // 4. KILLS & ASSISTANTS INSERT
        for (let killIdx = 0; killIdx < match.kills.length; killIdx++) {
          const kill = match.kills[killIdx];
          const killCombinedId = `${matchId}_kill_${killIdx}`;

          tx.insert(kills)
            .values({
              combinedId: killCombinedId,
              matchId: matchId,
              round: kill.round,
              killerPuuid: kill.killer.puuid,
              killerTeamId: kill.killer.team,
              victimPuuid: kill.victim.puuid,
              victimTeamId: kill.victim.team,
              x: kill.location?.x || 0,
              y: kill.location?.y || 0,
              secondaryFireMode: kill.secondary_fire_mode,
              timeInMatchInMs: Number(kill.time_in_match_in_ms),
              timeInRoundInMs: Number(kill.time_in_round_in_ms),
              weaponId: kill.weapon?.id || "",
            })
            .onConflictDoNothing();

          if (kill.assistants && kill.assistants.length > 0) {
            const assistantValues = kill.assistants.map((assistant) => ({
              combinedId: `${killCombinedId}_ast_${assistant.puuid}`,
              killCombinedId: killCombinedId,
              puuid: assistant.puuid,
              teamId: assistant.team,
            }));

            tx.insert(killAssistants)
              .values(assistantValues)
              .onConflictDoNothing();
          }
        }
      }
    });

    // 5. INFOS ABFRAGEN UND ZURÜCKGEBEN (entspricht Prisma `include: { ... }`)
    if (registeredMatchIds.length === 0) return [];

    const result = await db.query.matches.findMany({
      where: (matches, { inArray }) => inArray(matches.id, registeredMatchIds),
      with: {
        players: true,
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
      },
    });

    return result;
  } catch (error) {
    console.error("Error in match_fetch:", error);
    return [];
  }
}
