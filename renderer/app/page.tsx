"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DownloadCloud, Settings2 } from "lucide-react";
import { MatchResults } from "./result";
import { MatchesLoader } from "./loader";
import React from "react";
import { MatchPopulated } from "../../main/functions/match/get-all";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  const [matches, setMatches] = React.useState<MatchPopulated[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  React.useEffect(() => {
    async function load() {
      setLoading(true);
      setMatches(await window.db.match_getAll());
      setLoading(false);
    }
    load();
  }, []);
  return (
    <div className="flex h-full min-h-screen max-w-screen flex-col gap-4 p-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-primary font-extrabold">How bad is it?</h1>
        <div className="flex flex-row items-center gap-2">
          <Button>
            <DownloadCloud /> Load last game
          </Button>
          <Link href={"/settings"}>
            <Button variant={"secondary"}>
              <Settings2 /> Settings
            </Button>
          </Link>
        </div>
      </div>
      <MatchesLoader
        addNewlyLoadedMatches={(m) =>
          setMatches((prev) => {
            const prevCopy = [...prev];
            m.filter(
              (a) => prevCopy.find((e) => e.id === a.id) === undefined,
            ).forEach((e) => prevCopy.push(e));

            return prevCopy;
          })
        }
      />
      {loading && (
        <Card>
          <CardContent>
            <Skeleton className="shimmer-color-accent h-30 w-full rounded-md" />
          </CardContent>
        </Card>
      )}
      {!loading && <MatchResults matches={matches} />}
    </div>
  );
}
