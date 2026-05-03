import { db } from "@/lib/db";
import { getScoreboardForUser } from "@/services/scoreboard.service";

export type LeaderboardRow = {
  scoreboardPlayerId: string;
  playerId: string;
  name: string;
  totalScore: number;
  roundsPlayed: number;
  wins: number;
};

export async function getLeaderboard(scoreboardId: string, userId: string): Promise<LeaderboardRow[]> {
  await getScoreboardForUser(scoreboardId, userId);

  const [memberships, scores, wins] = await Promise.all([
    db.scoreboardPlayer.findMany({
      where: { scoreboardId },
      include: { player: true },
      orderBy: { createdAt: "asc" }
    }),
    db.roundPlayer.groupBy({
      by: ["scoreboardPlayerId"],
      where: {
        round: {
          scoreboardId,
          scoreboard: {
            ownerUserId: userId
          }
        }
      },
      _sum: {
        score: true
      },
      _count: {
        roundId: true
      }
    }),
    db.roundPlayer.groupBy({
      by: ["scoreboardPlayerId"],
      where: {
        placement: 1,
        round: {
          scoreboardId,
          scoreboard: {
            ownerUserId: userId
          }
        }
      },
      _count: {
        roundId: true
      }
    })
  ]);

  const scoreMap = new Map(scores.map((score) => [score.scoreboardPlayerId, score]));
  const winMap = new Map(wins.map((win) => [win.scoreboardPlayerId, win._count.roundId]));

  return memberships
    .map((membership) => {
      const aggregate = scoreMap.get(membership.id);
      return {
        scoreboardPlayerId: membership.id,
        playerId: membership.playerId,
        name: membership.nickname || membership.player.displayName,
        totalScore: aggregate?._sum.score ?? 0,
        roundsPlayed: aggregate?._count.roundId ?? 0,
        wins: winMap.get(membership.id) ?? 0
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore || a.name.localeCompare(b.name));
}
