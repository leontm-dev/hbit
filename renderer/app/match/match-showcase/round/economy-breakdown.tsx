import {
  Bar,
  EvilBarChart,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/evilcharts/charts/bar-chart";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MatchPopulated } from "../../../../../main/functions/match/get-all";
import { GearsResponse, WeaponsResponse } from "@valpro-labs/valorant-api";
import React from "react";
import Image from "next/image";

type Props = {
  round: MatchPopulated["rounds"][number];
  weapons: WeaponsResponse;
  gears: GearsResponse;
};
function findMostProminentString(array: string[]) {
  if (array.length == 0) return null;
  const modeMap: Map<string, number> = new Map();
  var maxEl = array[0],
    maxCount = 1;
  for (var i = 0; i < array.length; i++) {
    var el = array[i];
    if (!modeMap.get(el)) modeMap.set(el, 1);
    else modeMap.set(el, (modeMap.get(el) || 0) + 1);
    if ((modeMap.get(el) || 0) > maxCount) {
      maxEl = el;
      maxCount = modeMap.get(el) || 0;
    }
  }
  return maxEl;
}
export function EconomyBreakdownRound(props: Props) {
  const mostProminentGunId = React.useMemo(() => {
    const arr = props.round.playerStats.map((p) => p.weaponId);
    return findMostProminentString(arr);
  }, [props.round.playerStats]);
  const mostProminentGearId = React.useMemo(() => {
    const arr = props.round.playerStats
      .map((p) => p.armorId)
      .filter((e) => e !== null);
    return findMostProminentString(arr);
  }, [props.round.playerStats]);

  const data: { item: string; count: number }[] = React.useMemo(() => {
    const map: Map<string, number> = new Map();

    props.round.playerStats.map((p) => {
      const weapon = props.weapons.find((w) => w.uuid === p.weaponId);
      if (!weapon) return;
      const armor = props.gears.find((a) => a.uuid === p.armorId);

      const key = `${weapon?.displayName} & ${armor?.displayName || "No armor"}`;

      map.set(key, (map.get(key) || 0) + 1);
    });

    return Array.from(map.entries().map((e) => ({ item: e[0], count: e[1] })));
  }, [props.weapons, props.gears, props.round.playerStats]);
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>∅ Loadout value</CardTitle>
          </CardHeader>
          <CardContent>
            $
            {Number(
              props.round.playerStats.reduce((s, c) => s + c.loadoutValue, 0) /
                10,
            ).toFixed(2)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>∅ Loadout value (Team Red)</CardTitle>
          </CardHeader>
          <CardContent>
            $
            {Number(
              props.round.playerStats
                .filter((p) => p.teamId === "Red")
                .reduce((s, c) => s + c.loadoutValue, 0) / 10,
            ).toFixed(2)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>∅ Loadout value (Team Green)</CardTitle>
          </CardHeader>
          <CardContent>
            $
            {Number(
              props.round.playerStats
                .filter((p) => p.teamId === "Blue")
                .reduce((s, c) => s + c.loadoutValue, 0) / 10,
            ).toFixed(2)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>∅ $ remaining</CardTitle>
          </CardHeader>
          <CardContent>
            $
            {Number(
              props.round.playerStats.reduce(
                (s, c) => s + c.remainingCredits,
                0,
              ) / 10,
            ).toFixed(2)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>∅ $ remaining (Team Red)</CardTitle>
          </CardHeader>
          <CardContent>
            $
            {Number(
              props.round.playerStats
                .filter((p) => p.teamId === "Red")
                .reduce((s, c) => s + c.remainingCredits, 0) / 10,
            ).toFixed(2)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>∅ $ remaining (Team Green)</CardTitle>
          </CardHeader>
          <CardContent>
            $
            {Number(
              props.round.playerStats
                .filter((p) => p.teamId !== "Red")
                .reduce((s, c) => s + c.remainingCredits, 0) / 10,
            ).toFixed(2)}
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Most prominent gun</CardTitle>
          </CardHeader>
          <CardContent>
            {props.weapons.find((w) => w.uuid === mostProminentGunId) && (
              <Image
                src={
                  props.weapons.find((w) => w.uuid === mostProminentGunId)
                    ?.displayIcon || ""
                }
                alt=""
                height={60}
                width={200}
              />
            )}
          </CardContent>
          <CardFooter>
            Bought{" "}
            {
              props.round.playerStats.filter(
                (e) => e.weaponId === mostProminentGunId,
              ).length
            }{" "}
            times
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most prominent armor</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            {props.gears.find((w) => w.uuid === mostProminentGearId) && (
              <Image
                src={
                  props.gears.find((w) => w.uuid === mostProminentGearId)
                    ?.displayIcon || ""
                }
                alt=""
                height={60}
                width={60}
              />
            )}
          </CardContent>
          <CardFooter>
            Bought{" "}
            {
              props.round.playerStats.filter(
                (e) => e.armorId === mostProminentGearId,
              ).length
            }{" "}
            times
          </CardFooter>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Loadout variety</CardTitle>
        </CardHeader>
        <CardContent>
          <EvilBarChart
            config={{
              count: {
                label: "Count",
                colors: {
                  light: ["#7008e7"],
                  dark: ["#7008e7"],
                },
              },
            }}
            data={data}
            layout="horizontal"
            className="h-100"
          >
            <Tooltip />
            <XAxis dataKey={"count"} />
            <YAxis dataKey={"item"} />
            <Bar dataKey="count" variant="hatched" />
          </EvilBarChart>
        </CardContent>
        <CardFooter>{data.length} different loadout(s) in play</CardFooter>
      </Card>
    </div>
  );
}
