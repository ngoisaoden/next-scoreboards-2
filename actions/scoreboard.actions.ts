"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { actionError, validationError, type ActionResult } from "@/lib/action-result";
import { requireUser } from "@/lib/auth";
import { createScoreboardSchema, updateScoreboardSchema } from "@/lib/validations";
import {
  createScoreboardForUser,
  deleteScoreboardForUser,
  updateScoreboardForUser
} from "@/services/scoreboard.service";

function scoreboardInputFromFormData(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? "")
  };
}

export async function createScoreboard(input: FormData | unknown): Promise<ActionResult> {
  const rawInput = input instanceof FormData ? scoreboardInputFromFormData(input) : input;
  const parsed = createScoreboardSchema.safeParse(rawInput);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  let scoreboardId: string;
  const user = await requireUser();

  try {
    const scoreboard = await createScoreboardForUser(user.id, parsed.data);
    scoreboardId = scoreboard.id;
    revalidatePath("/scoreboards");
  } catch (error) {
    return actionError(error);
  }

  redirect(`/scoreboards/${scoreboardId}`);
}

export async function updateScoreboard(scoreboardId: string, input: FormData | unknown): Promise<ActionResult> {
  const rawInput = input instanceof FormData ? scoreboardInputFromFormData(input) : input;
  const parsed = updateScoreboardSchema.safeParse(rawInput);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const user = await requireUser();

  try {
    await updateScoreboardForUser(scoreboardId, user.id, parsed.data);
    revalidatePath("/scoreboards");
    revalidatePath(`/scoreboards/${scoreboardId}`);
    return { success: true };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteScoreboard(scoreboardId: string): Promise<ActionResult> {
  const user = await requireUser();

  try {
    await deleteScoreboardForUser(scoreboardId, user.id);
    revalidatePath("/scoreboards");
  } catch (error) {
    return actionError(error);
  }

  redirect("/scoreboards");
}
