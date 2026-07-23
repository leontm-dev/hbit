"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import React from "react";
import { MatchPopulated } from "../../../../main/functions/match/get-all";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AgentResponse,
  AgentsResponse,
  CompetitiveTiersResponse,
  GearsResponse,
  MapResponse,
  ValorantApi,
  WeaponsResponse,
} from "@valpro-labs/valorant-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import cn from "cnfast";
import Image from "next/image";
import { PlayerTableFullGame } from "./player-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { RoundShowcase } from "./round";

export function MatchShowcase() {
  const searchParams = useSearchParams();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [match, setMatch] = React.useState<MatchPopulated>();
  const [map, setMap] = React.useState<MapResponse>();
  const [agents, setAgents] = React.useState<AgentsResponse>([]);
  const [player, setPlayer] =
    React.useState<MatchPopulated["players"][number]>();
  const [agent, setAgent] = React.useState<AgentResponse>();
  const [tiers, setTiers] =
    React.useState<CompetitiveTiersResponse[number]["tiers"]>();
  const [weapons, setWeapons] = React.useState<WeaponsResponse>();
  const [gears, setGears] = React.useState<GearsResponse>();
  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      const id = searchParams.get("id");
      if (!id) redirect("/");

      const match = await window.db.match_getOne(id);
      if (!match) redirect("/");

      setMatch(match);

      const puuid = await window.store.get("user-puuid");
      if (!puuid) redirect("/");

      setPlayer(match.players.find((p) => p.puuid === puuid));

      const valorant = new ValorantApi();
      const agentsResponse = await valorant.agentsEndpoints.getAgentsV1();
      setAgents(agentsResponse);
      setWeapons(await valorant.weaponsEndpoints.getWeaponsV1());
      setGears(await valorant.gearEndpoints.getGearV1());
      setAgent(
        agentsResponse.find(
          (a) =>
            a.uuid === match.players.find((p) => p.puuid === puuid)?.agentId,
        ),
      );

      const map = await valorant.mapsEndpoints.getMapByUuidV1(match.mapId);
      if (!map) redirect("/");

      const tier =
        await valorant.competitiveTiersEndpoints.getCompetitiveTiersV1();
      if (!tier) redirect("/");
      setTiers(tier[tier.length - 1].tiers || []);

      setMap(map);
      setLoading(false);
    }
    loadData();
  }, []);
  return (
    <main className="flex h-screen max-w-screen flex-col gap-4 overflow-hidden p-4">
      <div className="flex shrink-0 flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <Link href={"/"}>
            <Button variant={"ghost"} size={"icon"}>
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className="text-primary font-extrabold">
            {!loading && map && match && player ? (
              `${map.displayName} // ${new Date(match.startedAt).toLocaleString("en-GB")} // ${match.winningTeamId === player.teamId ? "Win" : match.winningTeamId.length === 0 ? "Draw" : "Loss"}`
            ) : (
              <Skeleton className="h-8 w-20" />
            )}
          </h1>
        </div>
      </div>
      {match && map && agents && player && agent && tiers && (
        <Tabs
          className="flex min-h-0 w-full flex-1 flex-col overflow-hidden"
          defaultValue="overall"
        >
          <TabsList className="w-full shrink-0">
            <TabsTrigger value="overall">Overall</TabsTrigger>
            {match.rounds.map((round) => (
              <TabsTrigger
                key={round.id}
                className={cn(
                  round.winningTeamId === "Red"
                    ? "text-red-400"
                    : "text-green-400",
                )}
                value={round.id.toString()}
              >
                #{round.id + 1}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent
            value="overall"
            className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-4"
          >
            <div className="flex w-full flex-col gap-4">
              <div className="flex h-80 flex-row items-center justify-evenly gap-2">
                <div className="flex h-full w-full flex-row items-center justify-center gap-0">
                  <Image
                    src={agent.fullPortraitV2}
                    height={400}
                    width={100}
                    alt=""
                    className="h-full w-auto"
                  />
                  <div className="-ml-10 flex flex-col gap-2">
                    <h2 className="decoration-primary text-3xl font-extrabold underline">
                      {player.name}#{player.tag}
                    </h2>
                    <div className="flex flex-row items-center gap-2 text-xl">
                      <p className="text-muted-foreground">K/D/A</p>
                      <p className="font-bold">
                        <span className="text-green-500">
                          {player.killsCount}
                        </span>
                        /
                        <span className="text-red-500">
                          {player.deathsCounts}
                        </span>
                        /<span>{player.assistsCount}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex h-full w-full flex-row items-center">
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>Team vs. Team</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableHead></TableHead>
                            <TableHead>Team Red</TableHead>
                            <TableHead>Team Green</TableHead>
                          </TableRow>
                          <TableRow>
                            <TableHead>K/D/A</TableHead>
                            <TableCell>
                              <p>
                                <span className="text-green-500">
                                  {match.players
                                    .filter((p) => p.teamId === "Red")
                                    .reduce((sum, p) => sum + p.killsCount, 0)}
                                </span>
                                /
                                <span className="text-red-500">
                                  {match.players
                                    .filter((p) => p.teamId === "Red")
                                    .reduce(
                                      (sum, p) => sum + p.deathsCounts,
                                      0,
                                    )}
                                </span>
                                /
                                <span>
                                  {match.players
                                    .filter((p) => p.teamId === "Red")
                                    .reduce(
                                      (sum, p) => sum + p.assistsCount,
                                      0,
                                    )}
                                </span>
                              </p>
                            </TableCell>
                            <TableCell>
                              <p>
                                <span className="text-green-500">
                                  {match.players
                                    .filter((p) => p.teamId === "Blue")
                                    .reduce((sum, p) => sum + p.killsCount, 0)}
                                </span>
                                /
                                <span className="text-red-500">
                                  {match.players
                                    .filter((p) => p.teamId === "Blue")
                                    .reduce(
                                      (sum, p) => sum + p.deathsCounts,
                                      0,
                                    )}
                                </span>
                                /
                                <span>
                                  {match.players
                                    .filter((p) => p.teamId === "Blue")
                                    .reduce(
                                      (sum, p) => sum + p.assistsCount,
                                      0,
                                    )}
                                </span>
                              </p>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableHead>Average ACS</TableHead>
                            <TableCell>
                              {Number(
                                match.players
                                  .filter((p) => p.teamId === "Red")
                                  .reduce((sum, p) => sum + p.score, 0) /
                                  match.rounds.length /
                                  5,
                              ).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {Number(
                                match.players
                                  .filter((p) => p.teamId === "Blue")
                                  .reduce((sum, p) => sum + p.score, 0) /
                                  match.rounds.length /
                                  5,
                              ).toFixed(2)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableHead>Average rank</TableHead>
                            <TableCell>
                              <Image
                                src={
                                  tiers.find(
                                    (t) =>
                                      t.tier ===
                                      Math.round(
                                        match.players
                                          .filter((p) => p.teamId === "Red")
                                          .reduce(
                                            (sum, p) =>
                                              sum + parseInt(p.tierId),
                                            0,
                                          ) / 5,
                                      ),
                                  )?.smallIcon || ""
                                }
                                alt=""
                                width={30}
                                height={30}
                                className="size-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Image
                                src={
                                  tiers.find(
                                    (t) =>
                                      t.tier ===
                                      Math.round(
                                        match.players
                                          .filter((p) => p.teamId === "Blue")
                                          .reduce(
                                            (sum, p) =>
                                              sum + parseInt(p.tierId),
                                            0,
                                          ) / 5,
                                      ),
                                  )?.smallIcon || ""
                                }
                                alt=""
                                width={30}
                                height={30}
                                className="size-8"
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <PlayerTableFullGame
                players={match.players}
                agents={agents}
                tiers={tiers}
                roundsCount={match.rounds.length}
              />
            </div>
          </TabsContent>
          {match.rounds.map((round) => (
            <TabsContent
              key={round.id}
              value={round.id.toString()}
              className="min-h-0 w-full flex-1 overflow-hidden p-4 data-[state=active]:flex"
            >
              <RoundShowcase
                round={round}
                agents={agents}
                players={match.players}
                map={map}
                player={player}
                match={match}
                armors={gears || []}
                weapons={weapons || []}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </main>
  );
}
