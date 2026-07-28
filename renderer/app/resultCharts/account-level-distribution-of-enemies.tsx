"use client";

import {
  EvilBarChart,
  Bar,
  XAxis,
  Grid,
  Tooltip,
} from "@/components/evilcharts/charts/bar-chart";
import { type ChartConfig } from "@/components/evilcharts/ui/chart";
import { ChartProps } from ".";
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EvilBrushRange } from "@/components/evilcharts/ui/evil-brush";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const chartConfig = {
  count: {
    label: "Count",
    colors: {
      light: ["#7008e7"],
      dark: ["#7008e7"],
    },
  },
} satisfies ChartConfig;

export function AccountLevelDistributionOfEnemies(props: ChartProps) {
  const [dateRange, setDateRange] = React.useState<{ start: Date; end: Date }>({
    start: new Date(new Date().setDate(new Date().getDate() - 14)),
    end: new Date(),
  });
  const data: { level: number; count: number }[] = React.useMemo(() => {
    const map: Map<number, number> = new Map();

    props.matches
      .filter(
        (m) =>
          new Date(m.startedAt).getTime() >=
            new Date(dateRange.start).getTime() &&
          new Date(m.startedAt).getTime() <= new Date(dateRange.end).getTime(),
      )
      .map((m) => m.players)
      .flat(1)
      .filter((p) => p.puuid !== props.hostPuuid)
      .map((p) => p.level)
      .map((l) => map.set(l, (map.get(l) || 0) + 1));

    for (
      let i = 1;
      i <= Array.from(map.keys()).sort((a, b) => a - b)[map.size - 1];
      i++
    ) {
      map.set(i, map.get(i) || 0);
    }

    return Array.from(map.entries())
      .map((v) => ({ level: v[0], count: v[1] }))
      .sort((a, b) => a.level - b.level);
  }, [props.matches, dateRange]);
  const [brushRange, setBrushRange] = React.useState<EvilBrushRange>({
    startIndex: 0,
    endIndex: 0,
  });
  React.useEffect(() => {
    setBrushRange({
      startIndex: data[0].level || 0,
      endIndex: data[data.length - 1].level || 0,
    });
  }, [data]);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Account level distribution (all)</CardTitle>
        <CardAction>
          <ToggleGroup variant={"outline"} type="single" defaultValue={"2w"}>
            <ToggleGroupItem
              value="all"
              onClick={() =>
                setDateRange({
                  start: new Date(
                    props.matches.sort(
                      (a, b) =>
                        new Date(a.startedAt).getTime() -
                        new Date(b.startedAt).getTime(),
                    )[0].startedAt,
                  ),
                  end: new Date(),
                })
              }
            >
              All time
            </ToggleGroupItem>
            <ToggleGroupItem
              value="6m"
              onClick={() =>
                setDateRange({
                  start: new Date(
                    new Date().setMonth(new Date().getMonth() - 6),
                  ),
                  end: new Date(),
                })
              }
            >
              6M
            </ToggleGroupItem>
            <ToggleGroupItem
              value="3m"
              onClick={() =>
                setDateRange({
                  start: new Date(
                    new Date().setDate(new Date().getDate() - 90),
                  ),
                  end: new Date(),
                })
              }
            >
              90d
            </ToggleGroupItem>
            <ToggleGroupItem
              value="1m"
              onClick={() =>
                setDateRange({
                  start: new Date(
                    new Date().setDate(new Date().getDate() - 30),
                  ),
                  end: new Date(),
                })
              }
            >
              30d
            </ToggleGroupItem>
            <ToggleGroupItem
              value="2w"
              onClick={() =>
                setDateRange({
                  start: new Date(
                    new Date().setDate(new Date().getDate() - 14),
                  ),
                  end: new Date(),
                })
              }
            >
              14d
            </ToggleGroupItem>
            <ToggleGroupItem
              value="7d"
              onClick={() =>
                setDateRange({
                  start: new Date(new Date().setDate(new Date().getDate() - 7)),
                  end: new Date(),
                })
              }
            >
              7d
            </ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent>
        <EvilBarChart
          data={data}
          config={chartConfig}
          className="col-span-2 h-full min-h-100 w-full"
          xDataKey="level"
          showBrush
          onBrushChange={(range) => setBrushRange(range)}
        >
          <Grid />
          <XAxis dataKey="level" />
          <Tooltip />
          <Bar dataKey="count" variant="default" isClickable />
        </EvilBarChart>
      </CardContent>
      <CardFooter>
        {data
          .filter(
            (d) =>
              d.level >= brushRange.startIndex &&
              d.level <= brushRange.endIndex,
          )
          .reduce((sum, current) => sum + current.count, 0)}{" "}
        individual player records on the graph right now. That is{" "}
        {Number(
          (data
            .filter(
              (d) =>
                d.level >= brushRange.startIndex &&
                d.level <= brushRange.endIndex,
            )
            .reduce((sum, current) => sum + current.count, 0) /
            data.reduce((sum, current) => sum + current.count, 0)) *
            100,
        ).toFixed(2)}
        % of all player records from the selected time frame.
      </CardFooter>
    </Card>
  );
}
