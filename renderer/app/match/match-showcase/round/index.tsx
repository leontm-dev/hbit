import { AgentsResponse, MapResponse } from "@valpro-labs/valorant-api";
import { MatchPopulated } from "../../../../../main/functions/match/get-all";
import cn from "cnfast";
import { Badge } from "@/components/ui/badge";
import { TrophyIcon } from "lucide-react";
import { PlayerTableRound } from "./player-table";

type Props = {
  round: MatchPopulated["rounds"][number];
  players: MatchPopulated["players"];
  agents: AgentsResponse;
  map: MapResponse;
  player: MatchPopulated["players"][number];
  match: MatchPopulated;
};
export function RoundShowcase(props: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center gap-4">
        <h2 className="text-2xl font-bold">Round #{props.round.id + 1}</h2>
        <div className="flex flex-row items-center gap-1">
          <Badge
            variant={"outline"}
            className={cn(
              "h-6 rounded-md",
              props.round.winningTeamId === props.player.teamId
                ? "border-green-500 text-green-500"
                : "border-red-500 text-red-500",
            )}
          >
            {props.round.winningTeamId === props.player.teamId ? "Win" : "Loss"}
          </Badge>
          {!props.round.ceremony.includes("Default") && (
            <Badge className="h-6 rounded-md">
              {props.round.ceremony.replaceAll("Ceremony", "")}
            </Badge>
          )}
          <Badge variant={"secondary"} className="h-6 rounded-md">
            <TrophyIcon />
            {props.round.result.length === 0 ? "Timer" : props.round.result}
          </Badge>
        </div>
      </div>
      <PlayerTableRound
        players={props.players}
        agents={props.agents}
        round={props.round}
        roundKills={props.match.kills.filter((k) => k.round === props.round.id)}
      />
    </div>
  );
}
