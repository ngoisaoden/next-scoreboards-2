"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { actionError, validationError, type ActionResult } from "@/lib/action-result";
import { requireUser } from "@/lib/auth";
import { createRoundSchema, updateRoundSchema } from "@/lib/validations";
import {
  createRoundForScoreboard,
  deleteRoundForScoreboard,
  getRoundDetails,
  updateRoundForScoreboard
} from "@/services/round.service";

export async function createRound(input: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = createRoundSchema.safeParse(input);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const user = await requireUser();

  try {
    const round = await createRoundForScoreboard(parsed.data.scoreboardId, user.id, {
      title: parsed.data.title,
      notes: parsed.data.notes,
      players: parsed.data.players
    });
    revalidatePath(`/scoreboards/${parsed.data.scoreboardId}`);
    revalidatePath(`/scoreboards/${parsed.data.scoreboardId}/leaderboard`);
    return { success: true, data: { id: round.id } };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateRound(roundId: string, input: unknown): Promise<ActionResult> {
  const parsed = updateRoundSchema.safeParse(input);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const user = await requireUser();

  try {
    const round = await updateRoundForScoreboard(roundId, user.id, parsed.data);
    revalidatePath(`/scoreboards/${round.scoreboardId}`);
    revalidatePath(`/scoreboards/${round.scoreboardId}/leaderboard`);
    revalidatePath(`/scoreboards/${round.scoreboardId}/rounds/${roundId}`);
    return { success: true };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteRound(roundId: string): Promise<ActionResult> {
  let scoreboardId: string;
  const user = await requireUser();

  try {
    const round = await getRoundDetails(roundId, user.id);
    scoreboardId = round.scoreboardId;
    await deleteRoundForScoreboard(roundId, user.id);
    revalidatePath(`/scoreboards/${scoreboardId}`);
    revalidatePath(`/scoreboards/${scoreboardId}/leaderboard`);
  } catch (error) {
    return actionError(error);
  }

  redirect(`/scoreboards/${scoreboardId}`);
}
