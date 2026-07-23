import {
  AgentsResponse,
  GearsResponse,
  MapResponse,
  WeaponsResponse,
} from "@valpro-labs/valorant-api";
import { MatchPopulated } from "../../../../../main/functions/match/get-all";
import cn from "cnfast";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, TrophyIcon } from "lucide-react";
import { PlayerTableRound } from "./player-table";
import { PlantDefuseRoundStats } from "./plant-defuse-stats";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import React from "react";
import { Button } from "@/components/ui/button";
import { TimelineRound } from "./timeline";
import { EconomyBreakdownRound } from "./economy-breakdown";

type Props = {
  round: MatchPopulated["rounds"][number];
  players: MatchPopulated["players"];
  agents: AgentsResponse;
  map: MapResponse;
  player: MatchPopulated["players"][number];
  match: MatchPopulated;
  weapons: WeaponsResponse;
  armors: GearsResponse;
};
const steps: string[] = ["", "OVERVIEW", "SCOREBOARD", "OBJECTIVES", "ECONOMY"];
export function RoundShowcase(props: Props) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  return (
    <div className="flex h-full min-h-0 w-full flex-row items-center gap-2 overflow-hidden">
      <Carousel
        setApi={setApi}
        orientation="vertical"
        className="h-full min-h-0 w-full flex-1 overflow-hidden"
      >
        <CarouselContent className="mt-0 h-full flex-col">
          <CarouselItem className="h-full min-h-full shrink-0 basis-full pt-0">
            <div className="flex h-full w-full flex-col gap-4 overflow-y-auto">
              <div className="flex flex-row items-center gap-4">
                <h2 className="text-2xl font-bold">
                  Round #{props.round.id + 1}
                </h2>
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
                    {props.round.winningTeamId === props.player.teamId
                      ? "Win"
                      : "Loss"}
                  </Badge>
                  {!props.round.ceremony.includes("Default") && (
                    <Badge className="h-6 rounded-md">
                      {props.round.ceremony.replaceAll("Ceremony", "")}
                    </Badge>
                  )}
                  <Badge variant={"secondary"} className="h-6 rounded-md">
                    <TrophyIcon />
                    {props.round.result.length === 0
                      ? "Timer"
                      : props.round.result}
                  </Badge>
                </div>
              </div>
            </div>
          </CarouselItem>
          <CarouselItem className="h-full min-h-full shrink-0 basis-full pt-0">
            <div className="flex h-full w-full flex-col gap-2 overflow-y-auto">
              <PlayerTableRound
                players={props.players}
                agents={props.agents}
                round={props.round}
                roundKills={props.match.kills.filter(
                  (k) => k.round === props.round.id,
                )}
                weapons={props.weapons}
                armors={props.armors}
              />
              <TimelineRound
                round={props.round}
                weapons={props.weapons}
                agents={props.agents}
                players={props.players}
                kills={props.match.kills.filter(
                  (k) => k.round === props.round.id,
                )}
              />
            </div>
          </CarouselItem>
          <CarouselItem className="h-full min-h-full shrink-0 basis-full pt-0">
            <div className="h-full w-full overflow-y-auto">
              <PlantDefuseRoundStats
                round={props.round}
                players={props.players}
                agents={props.agents}
              />
            </div>
          </CarouselItem>
          <CarouselItem className="h-full min-h-full shrink-0 basis-full pt-0">
            <div className="h-full w-full overflow-y-auto">
              <EconomyBreakdownRound
                weapons={props.weapons}
                round={props.round}
                gears={props.armors}
              />
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <div className="flex h-full w-14 shrink-0 flex-col items-center justify-evenly pl-2">
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => api?.scrollPrev()}
        >
          <ArrowUp />
        </Button>
        <p className="-rotate-90 text-xl font-bold">{steps[current]}</p>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => api?.scrollNext()}
        >
          <ArrowDown />
        </Button>
      </div>
    </div>
  );
}
