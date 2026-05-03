import { db } from "@/lib/db";

export function findRoundsForScoreboard(scoreboardId: string) {
  return db.round.findMany({
    where: { scoreboardId },
    include: {
      players: {
        include: {
          scoreboardPlayer: {
            include: { player: true }
          }
        },
        orderBy: [{ placement: "asc" }, { score: "desc" }]
      }
    },
    orderBy: { roundNumber: "desc" }
  });
}
