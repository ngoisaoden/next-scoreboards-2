import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { toNullableString } from "@/lib/utils";
import type { CreateRoundInput, UpdateRoundInput } from "@/lib/validations";
import { findRoundsForScoreboard } from "@/repositories/round.repository";
import { getScoreboardForUser } from "@/services/scoreboard.service";

async function verifyRoundPlayers(
  tx: Prisma.TransactionClient,
  scoreboardId: string,
  playerIds: string[]
) {
  const uniqueIds = [...new Set(playerIds)];
  const players = await tx.scoreboardPlayer.findMany({
    where: {
      id: { in: uniqueIds },
      scoreboardId
    },
    select: { id: true }
  });

  if (players.length !== uniqueIds.length) {
    throw new Error("This player does not belong to this scoreboard.");
  }
}

export async function listRoundsForScoreboard(scoreboardId: string, userId: string) {
  await getScoreboardForUser(scoreboardId, userId);
  return findRoundsForScoreboard(scoreboardId);
}

export async function getRoundDetails(roundId: string, userId: string) {
  const round = await db.round.findFirst({
    where: {
      id: roundId,
      scoreboard: { ownerUserId: userId }
    },
    include: {
      scoreboard: true,
      players: {
        include: {
          scoreboardPlayer: {
            include: { player: true }
          }
        },
        orderBy: [{ placement: "asc" }, { score: "desc" }]
      }
    }
  });

  if (!round) {
    throw new Error("You do not have access to this round.");
  }

  return round;
}

export async function createRoundForScoreboard(
  scoreboardId: string,
  userId: string,
  data: Omit<CreateRoundInput, "scoreboardId">
) {
  await getScoreboardForUser(scoreboardId, userId);

  return db.$transaction(async (tx) => {
    await verifyRoundPlayers(
      tx,
      scoreboardId,
      data.players.map((player) => player.scoreboardPlayerId)
    );

    const latestRound = await tx.round.findFirst({
      where: { scoreboardId },
      orderBy: { roundNumber: "desc" }
    });

    const nextRoundNumber = latestRound ? latestRound.roundNumber + 1 : 1;

    const round = await tx.round.create({
      data: {
        scoreboardId,
        roundNumber: nextRoundNumber,
        title: toNullableString(data.title),
        notes: toNullableString(data.notes)
      }
    });

    await tx.roundPlayer.createMany({
      data: data.players.map((player) => ({
        roundId: round.id,
        scoreboardPlayerId: player.scoreboardPlayerId,
        score: player.score,
        placement: player.placement ?? null
      }))
    });

    return round;
  });
}

export async function updateRoundForScoreboard(roundId: string, userId: string, data: UpdateRoundInput) {
  const existingRound = await getRoundDetails(roundId, userId);

  return db.$transaction(async (tx) => {
    await verifyRoundPlayers(
      tx,
      existingRound.scoreboardId,
      data.players.map((player) => player.scoreboardPlayerId)
    );

    await tx.roundPlayer.deleteMany({
      where: { roundId }
    });

    await tx.roundPlayer.createMany({
      data: data.players.map((player) => ({
        roundId,
        scoreboardPlayerId: player.scoreboardPlayerId,
        score: player.score,
        placement: player.placement ?? null
      }))
    });

    return tx.round.update({
      where: { id: roundId },
      data: {
        title: toNullableString(data.title),
        notes: toNullableString(data.notes)
      }
    });
  });
}

export async function deleteRoundForScoreboard(roundId: string, userId: string) {
  await getRoundDetails(roundId, userId);

  return db.round.delete({
    where: { id: roundId }
  });
}
