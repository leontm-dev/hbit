PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Kill` (
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
	FOREIGN KEY (`matchId`) REFERENCES `Match`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_Kill`("combinedId", "matchId", "round", "killerPuuid", "killerTeamId", "x", "y", "secondaryFireMode", "timeInMatchInMs", "timeInRoundInMs", "victimPuuid", "victimTeamId", "weaponId") SELECT "combinedId", "matchId", "round", "killerPuuid", "killerTeamId", "x", "y", "secondaryFireMode", "timeInMatchInMs", "timeInRoundInMs", "victimPuuid", "victimTeamId", "weaponId" FROM `Kill`;--> statement-breakpoint
DROP TABLE `Kill`;--> statement-breakpoint
ALTER TABLE `__new_Kill` RENAME TO `Kill`;--> statement-breakpoint
PRAGMA foreign_keys=ON;