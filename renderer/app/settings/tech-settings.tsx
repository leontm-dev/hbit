"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircleIcon, Key } from "lucide-react";
import Link from "next/link";
import React from "react";

export function TechSettings() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [key, setKey] = React.useState<string | undefined>(undefined);
  React.useEffect(() => {
    async function load() {
      setLoading(true);
      setKey(await window.store.get("user-key"));
      setLoading(false);
    }
    load();
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tech</CardTitle>
        <CardDescription>
          To keep this app free you need to provide the technical keys yourself
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Alert>
          <AlertCircleIcon />
          <AlertTitle>How to get an api key?</AlertTitle>
          <AlertDescription>
            Visit{" "}
            <Link href={"https://api.henrikdev.xyz/dashboard/"}>
              https://api.henrikdev.xyz/dashboard/
            </Link>
            , sign in with your discord account. Once the sign-in completed you
            can register an api key
          </AlertDescription>
        </Alert>
        {loading && <Skeleton className="w-full h-8" />}
        {!loading && (
          <InputGroup>
            <InputGroupAddon>
              <Key />
            </InputGroupAddon>
            <InputGroupInput
              defaultValue={key}
              onChange={(ev) => {
                if (ev.target.value.length === 0) {
                  setKey(undefined);
                  window.store.set("user-key", undefined);
                  return;
                }

                setKey(ev.target.value);
                window.store.set("user-key", ev.target.value);
              }}
              placeholder="HDEV-... (secret)"
              type="password"
            />
          </InputGroup>
        )}
      </CardContent>
      <CardFooter>
        Notice: Keys that are provided aren't shared with third-parties. They
        are only used to fetch information for your purposes. When registering
        keys, you decide how much you want to use them, not the app. There is no
        need to exceed free limits.
      </CardFooter>
    </Card>
  );
}
