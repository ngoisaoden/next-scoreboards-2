import { db } from "@/lib/db";
import { toNullableString } from "@/lib/utils";
import type { AddPlayerInput, UpdateScoreboardPlayerInput } from "@/lib/validations";
import { findPlayersForScoreboard } from "@/repositories/player.repository";
import { getScoreboardForUser } from "@/services/scoreboard.service";

export async function listPlayersForScoreboard(scoreboardId: string, userId: string) {
  await getScoreboardForUser(scoreboardId, userId);
  return findPlayersForScoreboard(scoreboardId);
}

export async function addPlayerToScoreboard(scoreboardId: string, userId: string, data: Omit<AddPlayerInput, "scoreboardId">) {
  await getScoreboardForUser(scoreboardId, userId);

  const duplicate = await db.scoreboardPlayer.findFirst({
    where: {
      scoreboardId,
      isActive: true,
      OR: [
        { nickname: { equals: data.displayName, mode: "insensitive" } },
        { player: { displayName: { equals: data.displayName, mode: "insensitive" } } }
      ]
    }
  });

  if (duplicate) {
    throw new Error("An active player with this name already exists.");
  }

  return db.$transaction(async (tx) => {
    const player = await tx.player.create({
      data: {
        displayName: data.displayName
      }
    });

    return tx.scoreboardPlayer.create({
      data: {
        scoreboardId,
        playerId: player.id,
        nickname: toNullableString(data.nickname)
      },
      include: { player: true }
    });
  });
}

export async function updateScoreboardPlayer(
  scoreboardPlayerId: string,
  userId: string,
  data: UpdateScoreboardPlayerInput
) {
  const membership = await db.scoreboardPlayer.findUnique({
    where: { id: scoreboardPlayerId },
    include: { scoreboard: true, player: true }
  });

  if (!membership || membership.scoreboard.ownerUserId !== userId) {
    throw new Error("This player does not belong to your scoreboard.");
  }

  return db.$transaction(async (tx) => {
    if (data.displayName) {
      await tx.player.update({
        where: { id: membership.playerId },
        data: { displayName: data.displayName }
      });
    }

    return tx.scoreboardPlayer.update({
      where: { id: scoreboardPlayerId },
      data: {
        nickname: toNullableString(data.nickname)
      },
      include: { player: true }
    });
  });
}

export async function deactivateScoreboardPlayer(scoreboardPlayerId: string, userId: string) {
  const membership = await db.scoreboardPlayer.findUnique({
    where: { id: scoreboardPlayerId },
    include: { scoreboard: true }
  });

  if (!membership || membership.scoreboard.ownerUserId !== userId) {
    throw new Error("This player does not belong to your scoreboard.");
  }

  return db.scoreboardPlayer.update({
    where: { id: scoreboardPlayerId },
    data: { isActive: false }
  });
}
