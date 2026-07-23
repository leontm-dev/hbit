import {
  AgentsResponse,
  CompetitiveTiersResponse,
} from "@valpro-labs/valorant-api";
import { MatchPopulated } from "../../../../main/functions/match/get-all";
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

type Props = {
  agents: AgentsResponse;
  players: MatchPopulated["players"];
  tiers: CompetitiveTiersResponse[number]["tiers"];
  roundsCount: number;
};
export function PlayerTableFullGame(props: Props) {
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
              <TableHead>Rank</TableHead>
              <TableCell>ACS</TableCell>
              <TableHead>K/D/A</TableHead>
              <TableHead>Abilities</TableHead>
              <TableHead>Shots</TableHead>
              <TableHead>∆ Damage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="w-full">
            {props.players
              .sort((a, b) => b.score - a.score)
              .map((player) => {
                const agent = props.agents.find(
                  (a) => a.uuid === player.agentId,
                );
                const tier = props.tiers.find(
                  (t) => t.tier.toString() === player.tierId,
                );
                if (!agent || !tier) return <></>;

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
                    <TableCell>
                      <Tooltip>
                        <TooltipContent>
                          {tier.smallIcon ? tier.tierName : "UNRATED"}
                        </TooltipContent>
                        <TooltipTrigger asChild>
                          <Image
                            src={
                              tier.smallIcon ||
                              "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/0/smallicon.png"
                            }
                            alt=""
                            height={30}
                            width={30}
                            className="size-8"
                          />
                        </TooltipTrigger>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {Number(player.score / props.roundsCount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <p>
                        <span className="text-green-500">
                          {player.killsCount}
                        </span>
                        /
                        <span className="text-red-500">
                          {player.deathsCounts}
                        </span>
                        /<span>{player.assistsCount}</span>
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row items-center gap-2">
                        <div className="flex flex-row items-center gap-1">
                          <p>{player.grenadeCastCount}x</p>
                          <Image
                            src={
                              agent.abilities.find((a) => a.slot === "Grenade")!
                                .displayIcon
                            }
                            alt=""
                            height={20}
                            width={20}
                          />
                        </div>
                        <div className="flex flex-row items-center gap-1">
                          <p>{player.ability1CastCount}x</p>
                          <Image
                            src={
                              agent.abilities.find(
                                (a) => a.slot === "Ability1",
                              )!.displayIcon
                            }
                            alt=""
                            height={20}
                            width={20}
                          />
                        </div>
                        <div className="flex flex-row items-center gap-1">
                          <p>{player.ability2CastCount}x</p>
                          <Image
                            src={
                              agent.abilities.find(
                                (a) => a.slot === "Ability2",
                              )!.displayIcon
                            }
                            alt=""
                            height={20}
                            width={20}
                          />
                        </div>
                        <div className="flex flex-row items-center gap-1">
                          <p>{player.ultimateCastCount}x</p>
                          <Image
                            src={
                              agent.abilities.find(
                                (a) => a.slot === "Ultimate",
                              )!.displayIcon
                            }
                            alt=""
                            height={20}
                            width={20}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row items-center gap-2">
                        <PersonStanding className="size-8" />
                        <div className="flex h-full flex-col justify-evenly">
                          <div className="flex flex-row items-center gap-2 text-[8px]">
                            <p>{player.headShotsCount}</p>
                            <p className="text-muted-foreground">HEAD</p>
                          </div>
                          <div className="flex flex-row items-center gap-2 text-[8px]">
                            <p>{player.bodyShotsCount}</p>
                            <p className="text-muted-foreground">BODY</p>
                          </div>
                          <div className="flex flex-row items-center gap-2 text-[8px]">
                            <p>{player.legShotsCount}</p>
                            <p className="text-muted-foreground">LEG</p>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipContent>
                          <p>Dealt: {player.damageDealt}</p>
                          <p>Received: {player.damageReceived}</p>
                        </TooltipContent>
                        <TooltipTrigger asChild>
                          <p>
                            Net:{" "}
                            {String(player.damageDealt - player.damageReceived)}
                          </p>
                        </TooltipTrigger>
                      </Tooltip>
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
