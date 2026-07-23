import {
  AgentsResponse,
  GearsResponse,
  WeaponsResponse,
} from "@valpro-labs/valorant-api";
import { MatchPopulated } from "../../../../../main/functions/match/get-all";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import cn from "cnfast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonStanding } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  agents: AgentsResponse;
  players: MatchPopulated["players"];
  round: MatchPopulated["rounds"][number];
  roundKills: MatchPopulated["kills"];
  armors: GearsResponse;
  weapons: WeaponsResponse;
};
export function PlayerTableRound(props: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scoreboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableCell>CS</TableCell>
              <TableHead>K/D/A</TableHead>
              <TableHead>Abilities</TableHead>
              <TableHead>Shots</TableHead>
              <TableHead>∆ Damage</TableHead>
              <TableHead>$ Remaining</TableHead>
              <TableHead>Loadout</TableHead>
              <TableHead>Loadout $</TableHead>
              <TableHead>AFK</TableHead>
              <TableHead>Penalty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="w-full">
            {props.players
              .sort(
                (a, b) =>
                  (props.round.playerStats.find((s) => s.puuid === b.puuid)
                    ?.score || 0) -
                  (props.round.playerStats.find((s) => s.puuid === a.puuid)
                    ?.score || 0),
              )
              .map((player) => {
                const agent = props.agents.find(
                  (a) => a.uuid === player.agentId,
                );
                const stats = props.round.playerStats.find(
                  (s) => s.puuid === player.puuid,
                );
                if (!agent || !stats) return <></>;
                const weapon = props.weapons.find(
                  (w) => stats.weaponId === w.uuid,
                );
                const armor = props.armors.find(
                  (a) => a.uuid === stats.armorId,
                );

                return (
                  <TableRow
                    key={player.puuid}
                    className={cn(
                      player.teamId === "Red"
                        ? "bg-red-500/20"
                        : "bg-green-500/20",
                    )}
                  >
                    <TableCell>
                      <Link
                        key={player.puuid}
                        href={`/player?id=${player.puuid}`}
                      >
                        <div className="flex flex-row items-center gap-2">
                          <Tooltip>
                            <TooltipContent>{agent.displayName}</TooltipContent>
                            <TooltipTrigger asChild>
                              <Image
                                src={agent.displayIconSmall}
                                alt=""
                                width={30}
                                height={30}
                              />
                            </TooltipTrigger>
                          </Tooltip>
                          <div className="flex flex-col gap-0">
                            <p className="text-md font-semibold">
                              {player.name}#{player.tag}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Level {player.level}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>{stats.score}</TableCell>
                    <TableCell>
                      <p className="flex flex-row items-center gap-1">
                        <span className="text-green-500">
                          {stats.killsCount}
                        </span>
                        /
                        <span className="text-red-500">
                          {
                            props.roundKills.filter(
                              (k) => k.victimPuuid === player.puuid,
                            ).length
                          }
                        </span>
                        /
                        <span>
                          {
                            props.roundKills.filter(
                              (k) =>
                                k.assistants.find(
                                  (a) => a.puuid === player.puuid,
                                ) !== undefined,
                            ).length
                          }
                        </span>
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row items-center gap-2">
                        <div className="flex flex-row items-center gap-1">
                          <p>{stats.grenadeCastCount}x</p>
                          <Image
                            src={
                              agent.abilities.find((a) => a.slot === "Grenade")!
                                .displayIcon
                            }
                            alt=""
                            height={20}
                            width={20}
                            className="size-6"
                          />
                        </div>
                        <div className="flex flex-row items-center gap-1">
                          <p>{stats.ability1CastCount}x</p>
                          <Image
                            src={
                              agent.abilities.find(
                                (a) => a.slot === "Ability1",
                              )!.displayIcon
                            }
                            alt=""
                            height={20}
                            width={20}
                            className="size-6"
                          />
                        </div>
                        <div className="flex flex-row items-center gap-1">
                          <p>{stats.ability2CastCount}x</p>
                          <Image
                            src={
                              agent.abilities.find(
                                (a) => a.slot === "Ability2",
                              )!.displayIcon
                            }
                            alt=""
                            height={20}
                            width={20}
                            className="size-6"
                          />
                        </div>
                        <div className="flex flex-row items-center gap-1">
                          <p>{stats.ultimateCastCount}x</p>
                          <Image
                            src={
                              agent.abilities.find(
                                (a) => a.slot === "Ultimate",
                              )!.displayIcon
                            }
                            alt=""
                            height={20}
                            width={20}
                            className="size-6"
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row items-center gap-2">
                        <PersonStanding className="size-8" />
                        <div className="flex h-full flex-col justify-evenly">
                          <div className="flex flex-row items-center gap-2 text-[8px]">
                            <p>{stats.headShotsCount}</p>
                            <p className="text-muted-foreground">HEAD</p>
                          </div>
                          <div className="flex flex-row items-center gap-2 text-[8px]">
                            <p>{stats.bodyShotsCount}</p>
                            <p className="text-muted-foreground">BODY</p>
                          </div>
                          <div className="flex flex-row items-center gap-2 text-[8px]">
                            <p>{stats.legShotsCount}</p>
                            <p className="text-muted-foreground">LEG</p>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipContent>
                          <p>
                            Dealt:{" "}
                            {stats.damageEvents.reduce(
                              (s, c) => s + c.damage,
                              0,
                            )}
                          </p>
                          <p>
                            Received:{" "}
                            {props.round.playerStats
                              .map((p) => p.damageEvents)
                              .flat(1)
                              .filter((e) => e.playerUuid === player.puuid)
                              .reduce((s, c) => s + c.damage, 0)}
                          </p>
                        </TooltipContent>
                        <TooltipTrigger asChild>
                          <p>
                            {String(
                              stats.damageEvents.reduce(
                                (s, c) => s + c.damage,
                                0,
                              ) -
                                props.round.playerStats
                                  .map((p) => p.damageEvents)
                                  .flat(1)
                                  .filter((e) => e.playerUuid === player.puuid)
                                  .reduce((s, c) => s + c.damage, 0),
                            )}
                          </p>
                        </TooltipTrigger>
                      </Tooltip>
                    </TableCell>
                    <TableCell>${stats.remainingCredits}</TableCell>
                    <TableCell>
                      <div className="flex flex-row items-center gap-2">
                        {weapon && (
                          <Image
                            src={weapon.displayIcon}
                            alt=""
                            height={30}
                            width={200}
                            className="h-6 w-auto"
                          />
                        )}
                        {armor && (
                          <Image
                            src={armor.displayIcon}
                            alt=""
                            height={30}
                            width={30}
                            className="size-6"
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>${stats.loadoutValue}</TableCell>
                    <TableCell>
                      <Checkbox
                        aria-readonly
                        defaultChecked={stats.wasAfk}
                        onChange={(ev) => ev.preventDefault()}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        aria-readonly
                        defaultChecked={stats.receivedPenalty}
                        onChange={(ev) => ev.preventDefault()}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
