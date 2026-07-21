import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DownloadCloud, Settings2 } from "lucide-react";
import { MatchResults } from "./result";
import { MatchesLoader } from "./loader";

export default function HomePage() {
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
      <MatchesLoader />
      <MatchResults />
    </div>
  );
}
