"use client";

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
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { GamepadIcon, Globe, HashIcon, PcCase, User } from "lucide-react";
import React from "react";

export function PlayerSettings() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [username, setUsername] = React.useState<string | undefined>(undefined);
  const [tag, setTag] = React.useState<string | undefined>(undefined);
  const [platform, setPlatform] = React.useState<string | undefined>(undefined);
  const [affinity, setAffinity] = React.useState<string | undefined>(undefined);
  React.useEffect(() => {
    async function load() {
      setLoading(true);
      setUsername(await window.store.get("user-name"));
      setTag(await window.store.get("user-tag"));
      setAffinity(await window.store.get("user-affinity"));
      setPlatform(await window.store.get("user-platform"));
      setLoading(false);
    }
    load();
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>User</CardTitle>
        <CardDescription>
          Configure your account so that the software can load your past games
        </CardDescription>
      </CardHeader>
      {loading && (
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <Skeleton />
          </div>
        </CardContent>
      )}
      {!loading && (
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <InputGroup>
              <InputGroupAddon>
                <User />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Your name..."
                defaultValue={username}
                onChange={(ev) => {
                  if (ev.target.value.length === 0) {
                    window.store.set("user-name", undefined);
                    setUsername(undefined);
                    return;
                  }

                  window.store.set("user-name", ev.target.value);
                  setUsername(ev.target.value);
                  return;
                }}
              />
            </InputGroup>
            <InputGroup>
              <InputGroupAddon>
                <HashIcon />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="#12345 (your tag)"
                defaultValue={tag}
                onChange={(ev) => {
                  if (ev.target.value.length === 0) {
                    window.store.set("user-tag", undefined);
                    setTag(undefined);
                    return;
                  }

                  window.store.set("user-tag", ev.target.value);
                  setTag(ev.target.value);
                  return;
                }}
              />
            </InputGroup>
          </div>
          <Select
            defaultValue={platform}
            onValueChange={(value) => {
              setPlatform(value);
              window.store.set("user-platform", value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Your platform... (pc, console)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pc">
                <PcCase /> PC
              </SelectItem>
              <SelectItem value="console">
                <GamepadIcon /> Console
              </SelectItem>
            </SelectContent>
          </Select>
          <InputGroup>
            <InputGroupAddon>
              <Globe />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Your affinity (eu, kr, br...)"
              defaultValue={affinity}
              onChange={(ev) => {
                if (ev.target.value.length === 0) {
                  setAffinity(undefined);
                  window.store.set("user-affinity", undefined);
                  return;
                }

                setAffinity(ev.target.value);
                window.store.set("user-affinity", ev.target.value);
              }}
            />
          </InputGroup>
        </CardContent>
      )}
    </Card>
  );
}
