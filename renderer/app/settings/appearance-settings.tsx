"use client";

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";

export function AppearanceSettings() {
  const { theme, setTheme, systemTheme } = useTheme();
  const handleThemeChange = (theme: string) => {
    setTheme(theme);
    window.store.set("preferred-theme", theme);
  };
  React.useEffect(() => {
    window.store.get("preferred-theme").then((res) => setResolvedTheme(res));
  }, []);
  const [resolvedTheme, setResolvedTheme] = React.useState<string>(
    theme || "light",
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Circle between light, dark and your desired system mode
        </CardDescription>
        <CardAction>
          <ToggleGroup
            onValueChange={(value) => {
              switch (value) {
                case "light":
                  handleThemeChange("light");
                case "dark":
                  handleThemeChange("dark");
                case "system":
                  handleThemeChange(systemTheme || "light");
              }
            }}
            type="single"
            defaultValue={resolvedTheme}
          >
            <ToggleGroupItem value="light">
              <Sun /> Light
            </ToggleGroupItem>
            <ToggleGroupItem value="dark">
              <Moon /> Dark
            </ToggleGroupItem>
            <ToggleGroupItem value="system">
              <Monitor /> System
            </ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
