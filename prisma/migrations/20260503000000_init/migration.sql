CREATE TABLE "scoreboards" (
  "id" TEXT NOT NULL,
  "owner_user_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "scoreboards_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "players" (
  "id" TEXT NOT NULL,
  "display_name" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "scoreboard_players" (
  "id" TEXT NOT NULL,
  "scoreboard_id" TEXT NOT NULL,
  "player_id" TEXT NOT NULL,
  "nickname" TEXT,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "scoreboard_players_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "rounds" (
  "id" TEXT NOT NULL,
  "scoreboard_id" TEXT NOT NULL,
  "round_number" INTEGER NOT NULL,
  "title" TEXT,
  "played_at" TIMESTAMP(3),
  "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "rounds_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "round_players" (
  "id" TEXT NOT NULL,
  "round_id" TEXT NOT NULL,
  "scoreboard_player_id" TEXT NOT NULL,
  "score" INTEGER NOT NULL DEFAULT 0,
  "placement" INTEGER,
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "round_players_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "scoreboard_players_scoreboard_id_player_id_key" ON "scoreboard_players"("scoreboard_id", "player_id");
CREATE UNIQUE INDEX "rounds_scoreboard_id_round_number_key" ON "rounds"("scoreboard_id", "round_number");
CREATE UNIQUE INDEX "round_players_round_id_scoreboard_player_id_key" ON "round_players"("round_id", "scoreboard_player_id");

ALTER TABLE "scoreboard_players" ADD CONSTRAINT "scoreboard_players_scoreboard_id_fkey"
  FOREIGN KEY ("scoreboard_id") REFERENCES "scoreboards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "scoreboard_players" ADD CONSTRAINT "scoreboard_players_player_id_fkey"
  FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "rounds" ADD CONSTRAINT "rounds_scoreboard_id_fkey"
  FOREIGN KEY ("scoreboard_id") REFERENCES "scoreboards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "round_players" ADD CONSTRAINT "round_players_round_id_fkey"
  FOREIGN KEY ("round_id") REFERENCES "rounds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "round_players" ADD CONSTRAINT "round_players_scoreboard_player_id_fkey"
  FOREIGN KEY ("scoreboard_player_id") REFERENCES "scoreboard_players"("id") ON DELETE CASCADE ON UPDATE CASCADE;
