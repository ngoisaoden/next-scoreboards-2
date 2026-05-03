"use server";

import { revalidatePath } from "next/cache";
import { actionError, validationError, type ActionResult } from "@/lib/action-result";
import { requireUser } from "@/lib/auth";
import { addPlayerSchema, updateScoreboardPlayerSchema } from "@/lib/validations";
import {
  addPlayerToScoreboard as addPlayerToScoreboardService,
  deactivateScoreboardPlayer as deactivateScoreboardPlayerService,
  updateScoreboardPlayer as updateScoreboardPlayerService
} from "@/services/player.service";

function addPlayerInputFromFormData(formData: FormData) {
  return {
    scoreboardId: String(formData.get("scoreboardId") ?? ""),
    displayName: String(formData.get("displayName") ?? ""),
    nickname: String(formData.get("nickname") ?? "")
  };
}

export async function addPlayerToScoreboard(input: FormData | unknown): Promise<ActionResult> {
  const rawInput = input instanceof FormData ? addPlayerInputFromFormData(input) : input;
  const parsed = addPlayerSchema.safeParse(rawInput);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const user = await requireUser();

  try {
    await addPlayerToScoreboardService(parsed.data.scoreboardId, user.id, {
      displayName: parsed.data.displayName,
      nickname: parsed.data.nickname
    });
    revalidatePath(`/scoreboards/${parsed.data.scoreboardId}`);
    revalidatePath(`/scoreboards/${parsed.data.scoreboardId}/players`);
    return { success: true };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateScoreboardPlayer(scoreboardPlayerId: string, input: FormData | unknown): Promise<ActionResult> {
  const rawInput =
    input instanceof FormData
      ? {
          displayName: String(input.get("displayName") ?? ""),
          nickname: String(input.get("nickname") ?? "")
        }
      : input;
  const parsed = updateScoreboardPlayerSchema.safeParse(rawInput);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const user = await requireUser();

  try {
    const player = await updateScoreboardPlayerService(scoreboardPlayerId, user.id, parsed.data);
    revalidatePath(`/scoreboards/${player.scoreboardId}`);
    revalidatePath(`/scoreboards/${player.scoreboardId}/players`);
    return { success: true };
  } catch (error) {
    return actionError(error);
  }
}

export async function deactivateScoreboardPlayer(scoreboardPlayerId: string): Promise<ActionResult> {
  const user = await requireUser();

  try {
    const player = await deactivateScoreboardPlayerService(scoreboardPlayerId, user.id);
    revalidatePath(`/scoreboards/${player.scoreboardId}`);
    revalidatePath(`/scoreboards/${player.scoreboardId}/players`);
    return { success: true };
  } catch (error) {
    return actionError(error);
  }
}
