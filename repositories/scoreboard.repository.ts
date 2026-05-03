import { db } from "@/lib/db";

export function findScoreboardsByOwner(ownerUserId: string) {
  return db.scoreboard.findMany({
    where: { ownerUserId },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: {
          players: true,
          rounds: true
        }
      }
    }
  });
}

export function findScoreboardForOwner(id: string, ownerUserId: string) {
  return db.scoreboard.findFirst({
    where: { id, ownerUserId },
    include: {
      _count: {
        select: {
          players: true,
          rounds: true
        }
      }
    }
  });
}
