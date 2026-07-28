"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { CloudDownload, ListStartIcon, RulerIcon } from "lucide-react";
import React from "react";
import { MatchPopulated } from "../../main/functions/match/get-all";

interface MatchesLoaderProps {
  onMatchesFetched?: () => void;
  addNewlyLoadedMatches: (matches: MatchPopulated[]) => void;
}

export function MatchesLoader(props: MatchesLoaderProps) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [start, setStart] = React.useState<number>(0);
  const [size, setSize] = React.useState<number>(10);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Load matches</CardTitle>
        <CardDescription>
          Adjust filters to dynamically load matches
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-center gap-2">
          <InputGroup>
            <InputGroupAddon>
              <ListStartIcon />
            </InputGroupAddon>
            <InputGroupInput
              defaultValue={start}
              type="number"
              step={1}
              onChange={(ev) => {
                if (isNaN(ev.target.valueAsNumber)) {
                  return setStart(0);
                }

                return setStart(ev.target.valueAsNumber);
              }}
            />
            <InputGroupAddon align={"inline-end"}>
              <InputGroupText>items to be skipped</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupAddon>
              <RulerIcon />
            </InputGroupAddon>
            <InputGroupInput
              defaultValue={size}
              type="number"
              step={1}
              onChange={(ev) => {
                if (isNaN(ev.target.valueAsNumber)) {
                  return setSize(0);
                }

                return setSize(ev.target.valueAsNumber);
              }}
              max={10}
            />
            <InputGroupAddon align={"inline-end"}>
              <InputGroupText>total items</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <Button
          onClick={() => {
            setLoading(true);
            window.db.match_fetch(size, start).then((res) => {
              props.addNewlyLoadedMatches(res);
              if (props.onMatchesFetched) {
                props.onMatchesFetched();
              }
              setLoading(false);
            });
          }}
          className="w-min"
          disabled={loading}
        >
          {!loading ? (
            <>
              <CloudDownload /> Fetch games
            </>
          ) : (
            "Fetching..."
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
