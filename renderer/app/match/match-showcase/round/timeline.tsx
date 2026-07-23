import { AgentsResponse, WeaponsResponse } from "@valpro-labs/valorant-api";
import { MatchPopulated } from "../../../../../main/functions/match/get-all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import cn from "cnfast";
import Image from "next/image";

type Props = {
  kills: MatchPopulated["kills"];
  round: MatchPopulated["rounds"][number];
  players: MatchPopulated["players"];
  agents: AgentsResponse;
  weapons: WeaponsResponse;
};
type Timeline = {
  timeInMs: number;
} & (TimelineDefuse | TimelineKill | TimelinePlant);
type TimelineKill = {
  killerPuuid: string;
  victimPuuid: string;
  weaponId: string;
  type: "kill";
};
type TimelinePlant = {
  planterPuuid: string;
  site: string;
  type: "plant";
};
type TimelineDefuse = {
  defuserPuuid: string;
  type: "defuse";
};
export function TimelineRound(props: Props) {
  const timeline: Timeline[] = React.useMemo(() => {
    const returnableArray: Timeline[] = props.kills.map((kill) => ({
      type: "kill",
      timeInMs: kill.timeInRoundInMs,
      killerPuuid: kill.killerPuuid,
      victimPuuid: kill.victimPuuid,
      weaponId: kill.weaponId,
    }));
    if (
      props.round.planted &&
      props.round.plantSite &&
      props.round.plantPlayerUuid &&
      props.round.plantRoundTimeInMs
    )
      returnableArray.push({
        type: "plant",
        timeInMs: props.round.plantRoundTimeInMs,
        planterPuuid: props.round.plantPlayerUuid,
        site: props.round.plantSite,
      });

    if (
      props.round.defused &&
      props.round.defusePlayerUuid &&
      props.round.defuseRoundTimeInMs
    )
      returnableArray.push({
        type: "defuse",
        timeInMs: props.round.defuseRoundTimeInMs,
        defuserPuuid: props.round.defusePlayerUuid,
      });
    return returnableArray;
  }, [props.kills, props.round]);
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row flex-wrap items-center gap-1">
          {timeline
            .sort((a, b) => a.timeInMs - b.timeInMs)
            .map((timelineEntry) => {
              switch (timelineEntry.type) {
                case "kill":
                  const killer = props.players.find(
                    (p) => p.puuid === timelineEntry.killerPuuid,
                  );
                  const victim = props.players.find(
                    (p) => p.puuid === timelineEntry.victimPuuid,
                  );
                  const weapon = props.weapons.find(
                    (w) => w.uuid === timelineEntry.weaponId,
                  );
                  if (!killer || !victim || !weapon) return <></>;

                  const killerAgent = props.agents.find(
                    (a) => a.uuid === killer.agentId,
                  );
                  const victimAgent = props.agents.find(
                    (a) => a.uuid === victim.agentId,
                  );
                  if (!killerAgent || !victimAgent) return <></>;

                  return (
                    <div
                      key={timelineEntry.timeInMs}
                      className={cn(
                        killer.teamId === "Red"
                          ? "bg-red-500/30"
                          : "bg-green-500/30",
                        "flex flex-row items-center gap-4 rounded-md p-1 text-xs",
                      )}
                    >
                      <p className="text-muted-foreground text-xs">
                        {Number(timelineEntry.timeInMs / 1000).toFixed(2)}s
                      </p>
                      <p className="italic">Kill</p>
                      <div className="flex flex-row items-center gap-2">
                        <div className="flex flex-row items-center gap-1">
                          <Image
                            src={killerAgent.displayIconSmall}
                            alt=""
                            height={20}
                            width={20}
                            className="size-4"
                          />
                          <p className="text-xs">
                            {killer.name}#{killer.tag}
                          </p>
                        </div>
                        <Image
                          height={20}
                          width={100}
                          src={weapon.displayIcon}
                          className="h-4 w-auto scale-x-[-1]"
                          alt=""
                        />
                        <div className="flex flex-row items-center gap-1">
                          <Image
                            src={victimAgent.displayIconSmall}
                            alt=""
                            height={20}
                            width={20}
                            className="size-4"
                          />
                          <p>
                            {victim.name}#{victim.tag}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                case "defuse":
                  const defuser = props.players.find(
                    (p) => p.puuid === timelineEntry.defuserPuuid,
                  );
                  if (!defuser) return <></>;
                  const defuserAgent = props.agents.find(
                    (a) => a.uuid === defuser.agentId,
                  );
                  if (!defuserAgent) return <></>;

                  return (
                    <div
                      key={timelineEntry.timeInMs}
                      className={cn(
                        defuser.teamId === "Red"
                          ? "bg-red-500/30"
                          : "bg-green-500/30",
                        "flex flex-row items-center gap-4 rounded-md p-1 text-xs",
                      )}
                    >
                      <p className="text-muted-foreground">
                        {Number(timelineEntry.timeInMs / 1000).toFixed(2)}s
                      </p>
                      <p className="italic">Defuse</p>
                      <div className="flex flex-row items-center gap-1">
                        <Image
                          src={defuserAgent.displayIconSmall}
                          height={20}
                          width={20}
                          className="size-4"
                          alt="s"
                        />
                        <p>
                          {defuser.name}#{defuser.tag}
                        </p>
                      </div>
                    </div>
                  );
                case "plant":
                  const planter = props.players.find(
                    (p) => p.puuid === timelineEntry.planterPuuid,
                  );
                  if (!planter) return <></>;
                  const planterAgent = props.agents.find(
                    (a) => a.uuid === planter.agentId,
                  );
                  if (!planterAgent) return <></>;

                  return (
                    <div
                      key={timelineEntry.timeInMs}
                      className={cn(
                        planter.teamId === "Red"
                          ? "bg-red-500/30"
                          : "bg-green-500/30",
                        "flex flex-row items-center gap-4 rounded-md p-1 text-xs",
                      )}
                    >
                      <p className="text-muted-foreground">
                        {Number(timelineEntry.timeInMs / 1000).toFixed(2)}s
                      </p>
                      <p className="italic">Plant ({timelineEntry.site})</p>
                      <div className="flex flex-row items-center gap-1">
                        <Image
                          src={planterAgent.displayIconSmall}
                          height={20}
                          width={20}
                          className="size-4"
                          alt=""
                        />
                        <p>
                          {planter.name}#{planter.tag}
                        </p>
                      </div>
                    </div>
                  );
              }
            })}
        </div>
      </CardContent>
    </Card>
  );
}
