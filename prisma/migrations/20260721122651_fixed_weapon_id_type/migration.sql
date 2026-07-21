-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MatchRoundPlayerStats" (
    "combinedId" TEXT NOT NULL PRIMARY KEY,
    "puuid" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "ability1CastCount" INTEGER NOT NULL,
    "ability2CastCount" INTEGER NOT NULL,
    "signatureCastCount" INTEGER NOT NULL,
    "ultimateCastCount" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "killsCount" INTEGER NOT NULL,
    "headShotsCount" INTEGER NOT NULL,
    "bodyShotsCount" INTEGER NOT NULL,
    "legShotsCount" INTEGER NOT NULL,
    "loadoutValue" INTEGER NOT NULL,
    "remainingCredits" INTEGER NOT NULL,
    "weaponId" TEXT NOT NULL,
    "armorId" TEXT,
    "wasAfk" BOOLEAN NOT NULL,
    "receivedPenalty" BOOLEAN NOT NULL,
    "stayedInSpawn" BOOLEAN NOT NULL,
    "matchRoundCombinedId" TEXT NOT NULL,
    CONSTRAINT "MatchRoundPlayerStats_matchRoundCombinedId_fkey" FOREIGN KEY ("matchRoundCombinedId") REFERENCES "MatchRound" ("combinedId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MatchRoundPlayerStats" ("ability1CastCount", "ability2CastCount", "armorId", "bodyShotsCount", "combinedId", "headShotsCount", "killsCount", "legShotsCount", "loadoutValue", "matchRoundCombinedId", "puuid", "receivedPenalty", "remainingCredits", "score", "signatureCastCount", "stayedInSpawn", "teamId", "ultimateCastCount", "wasAfk", "weaponId") SELECT "ability1CastCount", "ability2CastCount", "armorId", "bodyShotsCount", "combinedId", "headShotsCount", "killsCount", "legShotsCount", "loadoutValue", "matchRoundCombinedId", "puuid", "receivedPenalty", "remainingCredits", "score", "signatureCastCount", "stayedInSpawn", "teamId", "ultimateCastCount", "wasAfk", "weaponId" FROM "MatchRoundPlayerStats";
DROP TABLE "MatchRoundPlayerStats";
ALTER TABLE "new_MatchRoundPlayerStats" RENAME TO "MatchRoundPlayerStats";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
