"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DownloadCloud, Settings2 } from "lucide-react";
import { MatchResults } from "./result";
import { MatchesLoader } from "./loader";
import React from "react";

export default function HomePage() {
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleMatchesUpdated = () => {
    // Erhöht den Key, um MatchResults zu einem Refetch/Re-render zu zwingen
    setRefreshKey((prev) => prev + 1);
  };
  return (
    <div className="flex flex-col gap-4 p-4 h-full min-h-screen max-w-screen">
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
      <MatchesLoader onMatchesFetched={handleMatchesUpdated} />
      <MatchResults key={refreshKey} />
    </div>
  );
}
