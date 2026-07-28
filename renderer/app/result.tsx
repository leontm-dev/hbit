"use client";

import React, { cache } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MatchPopulated } from "../../main/functions/match/get-all";
import {
  AgentsResponse,
  MapsResponse,
  ValorantApi,
} from "@valpro-labs/valorant-api";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChartPieIcon, ListIcon } from "lucide-react";
import { ResultCharts } from "./resultCharts";
import cn from "cnfast";

type Props = {
  matches: MatchPopulated[];
};
export function MatchResults({ matches }: Props) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [puuid, setPuuid] = React.useState<string | undefined>(undefined);
  const [maps, setMaps] = React.useState<MapsResponse>([]);
  const [agents, setAgents] = React.useState<AgentsResponse>([]);

  React.useEffect(() => {
    const load = cache(async () => {
      setLoading(true);
      const valorantApi = new ValorantApi();
      setMaps(await valorantApi.mapsEndpoints.getMapsV1());
      setAgents(await valorantApi.agentsEndpoints.getAgentsV1());
      setPuuid(await window.store.get("user-puuid"));
      setLoading(false);
    });

    load();
  }, []);
  return (
    <Card>
      <CardContent>
        {loading && (
          <Skeleton className="shimmer-color-accent h-30 w-full rounded-md" />
        )}
        {!loading && matches.length === 0 && (
          <div className="bg-muted flex h-30 w-full flex-col items-center justify-center rounded-md">
            <p className="text-muted-foreground text-xs italic">
              No matches found.
            </p>
          </div>
        )}
        {!loading && matches.length !== 0 && (
          <Tabs className="w-full" defaultValue="list">
            <TabsList className="w-full">
              <TabsTrigger value="list">
                <ListIcon /> list
              </TabsTrigger>
              <TabsTrigger value="charts">
                <ChartPieIcon /> charts
              </TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <div className="flex flex-col gap-2">
                {matches
                  .sort(
                    (a, b) =>
                      new Date(b.startedAt).getTime() -
                      new Date(a.startedAt).getTime(),
                  )
                  .map((match) => {
                    const map = maps.find((m) => m.uuid === match.mapId);
                    const player = match.players.find((p) => p.puuid === puuid);
                    if (!map || !player) return <>{match.id}</>;
                    const agent = agents.find((a) => a.uuid === player.agentId);
                    if (!agent) return <></>;

                    return (
                      <Link key={match.id} href={`/match?id=${match.id}`}>
                        <div className="group hover:bg-primary flex flex-row items-center justify-between gap-8 rounded-md border-2 p-2 hover:cursor-pointer">
                          <div className="flex flex-row items-center justify-center gap-4">
                            <div className="bg-primary group-hover:bg-muted flex size-14 items-center justify-center rounded-md p-2">
                              <Image
                                src={agent.displayIconSmall}
                                width={40}
                                height={40}
                                alt=""
                                className="size-10 h-auto w-auto object-contain"
                              />
                            </div>
                            <div className="flex flex-col gap-0">
                              <p className="text-muted-foreground text-xs">
                                {new Date(match.startedAt).toLocaleString(
                                  "de-DE",
                                )}
                              </p>
                              <h3 className="text-xl font-bold">
                                {agent.displayName}
                              </h3>
                            </div>
                            <div className="flex flex-col gap-0">
                              <p className="text-muted-foreground text-xs">
                                Server: {match.cluster}
                              </p>
                              <h3 className="text-xl font-bold">
                                <span className="text-green-500">
                                  {player.killsCount}
                                </span>
                                /
                                <span className="text-red-500">
                                  {player.deathsCounts}
                                </span>
                                /{player.assistsCount}
                              </h3>
                            </div>
                            <div className="flex flex-col gap-0">
                              <p className="text-muted-foreground text-xs">
                                Headshot %
                              </p>
                              <h3 className="text-xl font-bold">
                                {Number(
                                  (player.headShotsCount /
                                    (player.headShotsCount +
                                      player.bodyShotsCount +
                                      player.legShotsCount)) *
                                    100,
                                ).toFixed(2)}
                                %
                              </h3>
                            </div>
                            <div className="flex flex-col gap-0">
                              <p className="text-muted-foreground text-xs">
                                Score
                              </p>
                              <h3 className="text-xl font-bold">
                                <span
                                  className={cn(
                                    match.rounds.filter(
                                      (e) => e.winningTeamId === player.teamId,
                                    ).length >
                                      match.rounds.filter(
                                        (e) =>
                                          e.winningTeamId !== player.teamId,
                                      ).length && "text-green-500",
                                  )}
                                >
                                  {
                                    match.rounds.filter(
                                      (e) => e.winningTeamId === player.teamId,
                                    ).length
                                  }
                                </span>
                                :
                                <span
                                  className={cn(
                                    match.rounds.filter(
                                      (e) => e.winningTeamId === player.teamId,
                                    ).length <
                                      match.rounds.filter(
                                        (e) =>
                                          e.winningTeamId !== player.teamId,
                                      ).length && "text-red-500",
                                  )}
                                >
                                  {
                                    match.rounds.filter(
                                      (e) => e.winningTeamId !== player.teamId,
                                    ).length
                                  }
                                </span>
                              </h3>
                            </div>
                          </div>
                          <div className="-m-2 flex h-18 overflow-hidden rounded-md rounded-bl-none border [clip-path:polygon(40px_0,100%_0,100%_100%,0_100%,0_40px)]">
                            <Image
                              src={map.listViewIcon}
                              width={200}
                              height={70}
                              alt=""
                              className="h-full w-auto object-cover"
                              loading="eager"
                            />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </TabsContent>
            <TabsContent value="charts">
              <ResultCharts matches={matches} hostPuuid={puuid || ""} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
