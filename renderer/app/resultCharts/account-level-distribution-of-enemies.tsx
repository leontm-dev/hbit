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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const data: { level: number; count: number }[] = React.useMemo(() => {
    const map: Map<number, number> = new Map();

    props.matches
      .map((m) => m.players)
      .flat(1)
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
  }, [props.matches]);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Account level distribution (all)</CardTitle>
      </CardHeader>
      <CardContent>
        <EvilBarChart
          data={data}
          config={chartConfig}
          className="h-full min-h-100 w-full col-span-2"
          xDataKey="level"
          showBrush
        >
          <Grid />
          <XAxis dataKey="level" />
          <Tooltip />
          <Bar dataKey="count" variant="default" isClickable />
        </EvilBarChart>
      </CardContent>
    </Card>
  );
}
