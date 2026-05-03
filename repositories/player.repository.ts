import { db } from "@/lib/db";

export function findPlayersForScoreboard(scoreboardId: string) {
  return db.scoreboardPlayer.findMany({
    where: { scoreboardId },
    include: { player: true },
    orderBy: [{ isActive: "desc" }, { createdAt: "asc" }]
  });
}
