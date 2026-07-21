CREATE TABLE `KillAssistant` (
	`combinedId` text PRIMARY KEY NOT NULL,
	`puuid` text NOT NULL,
	`teamId` text NOT NULL,
	`killCombinedId` text NOT NULL,
	FOREIGN KEY (`killCombinedId`) REFERENCES `Kill`(`combinedId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Kill` (
	`combinedId` text PRIMARY KEY NOT NULL,
	`matchId` text NOT NULL,
	`round` integer NOT NULL,
	`killerPuuid` text NOT NULL,
	`killerTeamId` text NOT NULL,
	`x` integer NOT NULL,
	`y` integer NOT NULL,
	`secondaryFireMode` integer NOT NULL,
	`timeInMatchInMs` integer NOT NULL,
	`timeInRoundInMs` integer NOT NULL,
	`victimPuuid` text NOT NULL,
	`victimTeamId` text NOT NULL,
	`weaponId` text NOT NULL,
	FOREIGN KEY (`matchId`) REFERENCES `Match`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `MatchPlayer` (
	`combinedId` text PRIMARY KEY NOT NULL,
	`puuid` text NOT NULL,
	`name` text NOT NULL,
	`tag` text NOT NULL,
	`ability1CastCount` integer NOT NULL,
	`ability2CastCount` integer NOT NULL,
	`signatureCastCount` integer NOT NULL,
	`ultimateCastCount` integer NOT NULL,
	`level` integer NOT NULL,
	`agentId` text NOT NULL,
	`afkRoundsCount` real NOT NULL,
	`friendlyFireIncoming` real NOT NULL,
	`friendlyFireOutgoing` real NOT NULL,
	`roundsInSpawnCount` real NOT NULL,
	`cardId` text NOT NULL,
	`titleId` text NOT NULL,
	`loadoutAverage` real NOT NULL,
	`loadoutOverall` integer NOT NULL,
	`averageSpent` real NOT NULL,
	`overallSpent` integer NOT NULL,
	`partyId` text NOT NULL,
	`sessionPlaytimeInMs` integer NOT NULL,
	`assistsCount` integer NOT NULL,
	`killsCount` integer NOT NULL,
	`deathsCounts` integer NOT NULL,
	`bodyShotsCount` integer NOT NULL,
	`headShotsCount` integer NOT NULL,
	`legShotsCount` integer NOT NULL,
	`damageDealt` integer NOT NULL,
	`damageReceived` integer NOT NULL,
	`score` integer NOT NULL,
	`tierId` text NOT NULL,
	`matchId` text NOT NULL,
	FOREIGN KEY (`matchId`) REFERENCES `Match`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `MatchRoundPlayerStats` (
	`combinedId` text PRIMARY KEY NOT NULL,
	`puuid` text NOT NULL,
	`teamId` text NOT NULL,
	`ability1CastCount` integer NOT NULL,
	`ability2CastCount` integer NOT NULL,
	`signatureCastCount` integer NOT NULL,
	`ultimateCastCount` integer NOT NULL,
	`score` integer NOT NULL,
	`killsCount` integer NOT NULL,
	`headShotsCount` integer NOT NULL,
	`bodyShotsCount` integer NOT NULL,
	`legShotsCount` integer NOT NULL,
	`loadoutValue` integer NOT NULL,
	`remainingCredits` integer NOT NULL,
	`weaponId` text NOT NULL,
	`armorId` text,
	`wasAfk` integer NOT NULL,
	`receivedPenalty` integer NOT NULL,
	`stayedInSpawn` integer NOT NULL,
	`matchRoundCombinedId` text NOT NULL,
	FOREIGN KEY (`matchRoundCombinedId`) REFERENCES `MatchRound`(`combinedId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `MatchRoundPlayerStatsDamageEvents` (
	`combinedId` text PRIMARY KEY NOT NULL,
	`playerUuid` text NOT NULL,
	`playerTeamId` text NOT NULL,
	`bodyShotCount` integer NOT NULL,
	`headShotCount` integer NOT NULL,
	`legShotCount` integer NOT NULL,
	`damage` integer NOT NULL,
	`matchRoundPlayerStatsCombinedId` text,
	FOREIGN KEY (`matchRoundPlayerStatsCombinedId`) REFERENCES `MatchRoundPlayerStats`(`combinedId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `MatchRound` (
	`combinedId` text PRIMARY KEY NOT NULL,
	`id` integer NOT NULL,
	`result` text NOT NULL,
	`ceremony` text NOT NULL,
	`winningTeamId` text NOT NULL,
	`defusePlayerUuid` text,
	`defusePlayerTeamId` text,
	`defuseRoundTimeInMs` integer,
	`defused` integer NOT NULL,
	`defuseX` integer,
	`defuseY` integer,
	`plantPlayerUuid` text,
	`plantPlayerTeamId` text,
	`plantSite` text,
	`planted` integer NOT NULL,
	`plantRoundTimeInMs` integer,
	`plantX` integer,
	`planY` integer,
	`matchId` text NOT NULL,
	FOREIGN KEY (`matchId`) REFERENCES `Match`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Match` (
	`id` text PRIMARY KEY NOT NULL,
	`gameLengthInMs` integer NOT NULL,
	`gameVersion` text NOT NULL,
	`mapId` text NOT NULL,
	`platform` text NOT NULL,
	`modeId` text NOT NULL,
	`seasonId` text NOT NULL,
	`cluster` text,
	`startedAt` text NOT NULL,
	`region` text NOT NULL,
	`winningTeamId` text NOT NULL
);
