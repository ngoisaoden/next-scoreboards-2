import { db } from "@/lib/db";
import { toNullableString } from "@/lib/utils";
import type { CreateScoreboardInput } from "@/lib/validations";
import { findScoreboardForOwner, findScoreboardsByOwner } from "@/repositories/scoreboard.repository";

export async function listScoreboardsForUser(userId: string) {
  return findScoreboardsByOwner(userId);
}

export async function getScoreboardForUser(scoreboardId: string, userId: string) {
  const scoreboard = await findScoreboardForOwner(scoreboardId, userId);

  if (!scoreboard) {
    throw new Error("You do not have access to this scoreboard.");
  }

  return scoreboard;
}

export async function createScoreboardForUser(userId: string, data: CreateScoreboardInput) {
  return db.scoreboard.create({
    data: {
      ownerUserId: userId,
      name: data.name,
      description: toNullableString(data.description)
    }
  });
}

export async function updateScoreboardForUser(scoreboardId: string, userId: string, data: CreateScoreboardInput) {
  await getScoreboardForUser(scoreboardId, userId);

  return db.scoreboard.update({
    where: { id: scoreboardId },
    data: {
      name: data.name,
      description: toNullableString(data.description)
    }
  });
}

export async function deleteScoreboardForUser(scoreboardId: string, userId: string) {
  await getScoreboardForUser(scoreboardId, userId);

  return db.scoreboard.delete({
    where: { id: scoreboardId }
  });
}
