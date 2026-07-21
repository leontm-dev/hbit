-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameLengthInMs" BIGINT NOT NULL,
    "gameVersion" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "modeId" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "cluster" TEXT,
    "startedAt" DATETIME NOT NULL,
    "region" TEXT NOT NULL,
    "winningTeamId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MatchRound" (
    "combinedId" TEXT NOT NULL PRIMARY KEY,
    "id" INTEGER NOT NULL,
    "result" TEXT NOT NULL,
    "ceremony" TEXT NOT NULL,
    "winningTeamId" TEXT NOT NULL,
    "defusePlayerUuid" TEXT,
    "defusePlayerTeamId" TEXT,
    "defuseRoundTimeInMs" BIGINT,
    "defused" BOOLEAN NOT NULL,
    "defuseX" INTEGER,
    "defuseY" INTEGER,
    "plantPlayerUuid" TEXT,
    "plantPlayerTeamId" TEXT,
    "plantSite" TEXT,
    "planted" BOOLEAN NOT NULL,
    "plantRoundTimeInMs" BIGINT,
    "plantX" INTEGER,
    "planY" INTEGER,
    "matchId" TEXT NOT NULL,
    CONSTRAINT "MatchRound_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MatchRoundPlayerStats" (
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
    "weaponId" INTEGER NOT NULL,
    "armorId" TEXT,
    "wasAfk" BOOLEAN NOT NULL,
    "receivedPenalty" BOOLEAN NOT NULL,
    "stayedInSpawn" BOOLEAN NOT NULL,
    "matchRoundCombinedId" TEXT NOT NULL,
    CONSTRAINT "MatchRoundPlayerStats_matchRoundCombinedId_fkey" FOREIGN KEY ("matchRoundCombinedId") REFERENCES "MatchRound" ("combinedId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MatchRoundPlayerStatsDamageEvents" (
    "combinedId" TEXT NOT NULL PRIMARY KEY,
    "playerUuid" TEXT NOT NULL,
    "playerTeamId" TEXT NOT NULL,
    "bodyShotCount" INTEGER NOT NULL,
    "headShotCount" INTEGER NOT NULL,
    "legShotCount" INTEGER NOT NULL,
    "damage" INTEGER NOT NULL,
    "matchRoundPlayerStatsCombinedId" TEXT,
    CONSTRAINT "MatchRoundPlayerStatsDamageEvents_matchRoundPlayerStatsCombinedId_fkey" FOREIGN KEY ("matchRoundPlayerStatsCombinedId") REFERENCES "MatchRoundPlayerStats" ("combinedId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MatchPlayer" (
    "combinedId" TEXT NOT NULL PRIMARY KEY,
    "puuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "ability1CastCount" INTEGER NOT NULL,
    "ability2CastCount" INTEGER NOT NULL,
    "signatureCastCount" INTEGER NOT NULL,
    "ultimateCastCount" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "agentId" TEXT NOT NULL,
    "afkRoundsCount" REAL NOT NULL,
    "friendlyFireIncoming" REAL NOT NULL,
    "friendlyFireOutgoing" REAL NOT NULL,
    "roundsInSpawnCount" REAL NOT NULL,
    "cardId" TEXT NOT NULL,
    "titleId" TEXT NOT NULL,
    "loadoutAverage" REAL NOT NULL,
    "loadoutOverall" INTEGER NOT NULL,
    "averageSpent" REAL NOT NULL,
    "overallSpent" INTEGER NOT NULL,
    "partyId" TEXT NOT NULL,
    "sessionPlaytimeInMs" BIGINT NOT NULL,
    "assistsCount" INTEGER NOT NULL,
    "killsCount" INTEGER NOT NULL,
    "deathsCounts" INTEGER NOT NULL,
    "bodyShotsCount" INTEGER NOT NULL,
    "headShotsCount" INTEGER NOT NULL,
    "legShotsCount" INTEGER NOT NULL,
    "damageDealt" INTEGER NOT NULL,
    "damageReceived" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "tierId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    CONSTRAINT "MatchPlayer_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Kill" (
    "combinedId" TEXT NOT NULL PRIMARY KEY,
    "matchId" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "killerPuuid" TEXT NOT NULL,
    "killerTeamId" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "secondaryFireMode" BOOLEAN NOT NULL,
    "timeInMatchInMs" BIGINT NOT NULL,
    "timeInRoundInMs" BIGINT NOT NULL,
    "victimPuuid" TEXT NOT NULL,
    "victimTeamId" TEXT NOT NULL,
    "weaponId" TEXT NOT NULL,
    CONSTRAINT "Kill_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KillAssistant" (
    "combinedId" TEXT NOT NULL PRIMARY KEY,
    "puuid" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "killCombinedId" TEXT NOT NULL,
    CONSTRAINT "KillAssistant_killCombinedId_fkey" FOREIGN KEY ("killCombinedId") REFERENCES "Kill" ("combinedId") ON DELETE RESTRICT ON UPDATE CASCADE
);
