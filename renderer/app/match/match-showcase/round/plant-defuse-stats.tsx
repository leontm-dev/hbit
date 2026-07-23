import { AgentsResponse } from "@valpro-labs/valorant-api";
import { MatchPopulated } from "../../../../../main/functions/match/get-all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

type Props = {
  round: MatchPopulated["rounds"][number];
  players: MatchPopulated["players"];
  agents: AgentsResponse;
};
export function PlantDefuseRoundStats(props: Props) {
  const plantedPlayer = props.players.find(
    (p) => p.puuid === props.round.plantPlayerUuid,
  );
  const plantedAgent = props.agents.find(
    (a) => a.uuid === plantedPlayer?.agentId,
  );
  const defusedPlayer = props.players.find(
    (p) => p.puuid === props.round.defusePlayerUuid,
  );
  const defusedAgent = props.agents.find(
    (a) => a.uuid === defusedPlayer?.agentId,
  );
  return (
    <div className="flex w-full flex-row items-center gap-2">
      {props.round.planted && plantedAgent && plantedPlayer && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Planted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row items-center gap-0">
              <Image
                src={plantedAgent.fullPortraitV2}
                width={200}
                height={200}
                alt=""
              />
              <div className="flex flex-col gap-0">
                <h3 className="decoration-primary text-xl underline">
                  {plantedPlayer.name}#{plantedPlayer.tag}
                </h3>
                <p>
                  At:{" "}
                  <span className="font-bold">
                    {Number(
                      (props.round.plantRoundTimeInMs || 0) / 1000,
                    ).toFixed(2)}
                    s
                  </span>
                </p>
                <p>
                  On:{" "}
                  <span className="font-bold">
                    {props.round.plantSite} Site
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {props.round.defused && defusedAgent && defusedPlayer && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Defused</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row items-center gap-0">
              <Image
                src={defusedAgent.fullPortraitV2}
                width={200}
                height={200}
                alt=""
              />
              <div className="flex flex-col gap-0">
                <h3 className="decoration-primary text-xl underline">
                  {defusedPlayer.name}#{defusedPlayer.tag}
                </h3>
                <p>
                  At:{" "}
                  <span className="font-bold">
                    {Number(
                      (props.round.defuseRoundTimeInMs || 0) / 1000,
                    ).toFixed(2)}
                    s
                  </span>
                </p>
                <p>
                  Took{" "}
                  <span className="font-bold">
                    {Number(
                      ((props.round.defuseRoundTimeInMs || 0) -
                        (props.round.plantRoundTimeInMs || 0)) /
                        1000,
                    ).toFixed(2)}
                    s
                  </span>{" "}
                  to defuse
                </p>
                <p>
                  Had{" "}
                  <span className="font-bold">
                    {Number(
                      45 -
                        ((props.round.defuseRoundTimeInMs || 0) -
                          (props.round.plantRoundTimeInMs || 0)) /
                          1000,
                    ).toFixed(2)}
                    s
                  </span>{" "}
                  on the clock
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
