PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_KillAssistant` (
	`combinedId` text PRIMARY KEY NOT NULL,
	`puuid` text NOT NULL,
	`teamId` text NOT NULL,
	`killCombinedId` text NOT NULL,
	FOREIGN KEY (`killCombinedId`) REFERENCES `Kill`(`combinedId`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_KillAssistant`("combinedId", "puuid", "teamId", "killCombinedId") SELECT "combinedId", "puuid", "teamId", "killCombinedId" FROM `KillAssistant`;--> statement-breakpoint
DROP TABLE `KillAssistant`;--> statement-breakpoint
ALTER TABLE `__new_KillAssistant` RENAME TO `KillAssistant`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_MatchPlayer` (
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
	`teamId` text NOT NULL,
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
	FOREIGN KEY (`matchId`) REFERENCES `Match`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_MatchPlayer`("combinedId", "puuid", "name", "tag", "ability1CastCount", "ability2CastCount", "signatureCastCount", "ultimateCastCount", "level", "agentId", "afkRoundsCount", "friendlyFireIncoming", "friendlyFireOutgoing", "roundsInSpawnCount", "cardId", "titleId", "loadoutAverage", "teamId", "loadoutOverall", "averageSpent", "overallSpent", "partyId", "sessionPlaytimeInMs", "assistsCount", "killsCount", "deathsCounts", "bodyShotsCount", "headShotsCount", "legShotsCount", "damageDealt", "damageReceived", "score", "tierId", "matchId") SELECT "combinedId", "puuid", "name", "tag", "ability1CastCount", "ability2CastCount", "signatureCastCount", "ultimateCastCount", "level", "agentId", "afkRoundsCount", "friendlyFireIncoming", "friendlyFireOutgoing", "roundsInSpawnCount", "cardId", "titleId", "loadoutAverage", "teamId", "loadoutOverall", "averageSpent", "overallSpent", "partyId", "sessionPlaytimeInMs", "assistsCount", "killsCount", "deathsCounts", "bodyShotsCount", "headShotsCount", "legShotsCount", "damageDealt", "damageReceived", "score", "tierId", "matchId" FROM `MatchPlayer`;--> statement-breakpoint
DROP TABLE `MatchPlayer`;--> statement-breakpoint
ALTER TABLE `__new_MatchPlayer` RENAME TO `MatchPlayer`;--> statement-breakpoint
CREATE TABLE `__new_MatchRoundPlayerStats` (
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
	FOREIGN KEY (`matchRoundCombinedId`) REFERENCES `MatchRound`(`combinedId`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_MatchRoundPlayerStats`("combinedId", "puuid", "teamId", "ability1CastCount", "ability2CastCount", "signatureCastCount", "ultimateCastCount", "score", "killsCount", "headShotsCount", "bodyShotsCount", "legShotsCount", "loadoutValue", "remainingCredits", "weaponId", "armorId", "wasAfk", "receivedPenalty", "stayedInSpawn", "matchRoundCombinedId") SELECT "combinedId", "puuid", "teamId", "ability1CastCount", "ability2CastCount", "signatureCastCount", "ultimateCastCount", "score", "killsCount", "headShotsCount", "bodyShotsCount", "legShotsCount", "loadoutValue", "remainingCredits", "weaponId", "armorId", "wasAfk", "receivedPenalty", "stayedInSpawn", "matchRoundCombinedId" FROM `MatchRoundPlayerStats`;--> statement-breakpoint
DROP TABLE `MatchRoundPlayerStats`;--> statement-breakpoint
ALTER TABLE `__new_MatchRoundPlayerStats` RENAME TO `MatchRoundPlayerStats`;--> statement-breakpoint
CREATE TABLE `__new_MatchRoundPlayerStatsDamageEvents` (
	`combinedId` text PRIMARY KEY NOT NULL,
	`playerUuid` text NOT NULL,
	`playerTeamId` text NOT NULL,
	`bodyShotCount` integer NOT NULL,
	`headShotCount` integer NOT NULL,
	`legShotCount` integer NOT NULL,
	`damage` integer NOT NULL,
	`matchRoundPlayerStatsCombinedId` text,
	FOREIGN KEY (`matchRoundPlayerStatsCombinedId`) REFERENCES `MatchRoundPlayerStats`(`combinedId`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_MatchRoundPlayerStatsDamageEvents`("combinedId", "playerUuid", "playerTeamId", "bodyShotCount", "headShotCount", "legShotCount", "damage", "matchRoundPlayerStatsCombinedId") SELECT "combinedId", "playerUuid", "playerTeamId", "bodyShotCount", "headShotCount", "legShotCount", "damage", "matchRoundPlayerStatsCombinedId" FROM `MatchRoundPlayerStatsDamageEvents`;--> statement-breakpoint
DROP TABLE `MatchRoundPlayerStatsDamageEvents`;--> statement-breakpoint
ALTER TABLE `__new_MatchRoundPlayerStatsDamageEvents` RENAME TO `MatchRoundPlayerStatsDamageEvents`;--> statement-breakpoint
CREATE TABLE `__new_MatchRound` (
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
	FOREIGN KEY (`matchId`) REFERENCES `Match`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_MatchRound`("combinedId", "id", "result", "ceremony", "winningTeamId", "defusePlayerUuid", "defusePlayerTeamId", "defuseRoundTimeInMs", "defused", "defuseX", "defuseY", "plantPlayerUuid", "plantPlayerTeamId", "plantSite", "planted", "plantRoundTimeInMs", "plantX", "planY", "matchId") SELECT "combinedId", "id", "result", "ceremony", "winningTeamId", "defusePlayerUuid", "defusePlayerTeamId", "defuseRoundTimeInMs", "defused", "defuseX", "defuseY", "plantPlayerUuid", "plantPlayerTeamId", "plantSite", "planted", "plantRoundTimeInMs", "plantX", "planY", "matchId" FROM `MatchRound`;--> statement-breakpoint
DROP TABLE `MatchRound`;--> statement-breakpoint
ALTER TABLE `__new_MatchRound` RENAME TO `MatchRound`;