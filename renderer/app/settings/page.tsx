import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { AppearanceSettings } from "./appearance-settings";
import { PlayerSettings } from "./player-settings";
import { TechSettings } from "./tech-settings";

export default function NextPage() {
  return (
    <main className="flex flex-col gap-4 p-4 h-full min-h-screen max-w-screen">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-primary font-extrabold">
          How bad is it? - Settings
        </h1>
        <div className="flex flex-row items-center gap-2">
          <Link href={"/"}>
            <Button size={"icon"}>
              <Home />
            </Button>
          </Link>
        </div>
      </div>
      <AppearanceSettings />
      <PlayerSettings />
      <TechSettings />
    </main>
  );
}
