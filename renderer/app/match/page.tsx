import { Suspense } from "react";
import { MatchShowcase } from "./match-showcase";
import { Spinner } from "@/components/ui/spinner";

export default async function MatchPage(props: PageProps<"/match">) {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex flex-col gap-2 items-center">
          <Spinner />
        </div>
      }
    >
      <MatchShowcase />
    </Suspense>
  );
}
