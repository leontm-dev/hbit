"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

export function DatabaseSettings() {
  const [size, setSize] = React.useState<number | undefined>(undefined);
  const [cleared, setCleared] = React.useState<boolean>(true);
  React.useEffect(() => {
    if (!cleared) return;
    window.db.match_count().then((res) => {
      setSize(res);
    });

    setCleared(true);
  }, [cleared]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Database</CardTitle>
        <CardDescription>
          Adjust settings, wipe the database and more stuff to clean up
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {size && <p>{size} matches fetched</p>}
        <div className="flex flex-row items-center gap-2">
          <Button
            variant={"destructive"}
            onClick={() =>
              window.db.match_clear().then((res) => setCleared(true))
            }
          >
            Clear database
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        Notice: Handle actions in this section with care, some are not
        reversible.
      </CardFooter>
    </Card>
  );
}
