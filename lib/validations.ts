import { z } from "zod";

export const createScoreboardSchema = z.object({
  name: z.string().trim().min(1, "Scoreboard name is required.").max(100),
  description: z.string().trim().max(500).optional().or(z.literal(""))
});

export const updateScoreboardSchema = createScoreboardSchema;

export const addPlayerSchema = z.object({
  scoreboardId: z.string().uuid(),
  displayName: z.string().trim().min(1, "Player name is required.").max(80),
  nickname: z.string().trim().max(80).optional().or(z.literal(""))
});

export const updateScoreboardPlayerSchema = z.object({
  nickname: z.string().trim().max(80).optional().or(z.literal("")),
  displayName: z.string().trim().min(1, "Player name is required.").max(80).optional()
});

export const roundPlayerInputSchema = z.object({
  scoreboardPlayerId: z.string().uuid(),
  score: z.coerce.number().int(),
  placement: z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? undefined : value),
    z.coerce.number().int().positive().optional()
  )
});

export const createRoundSchema = z.object({
  scoreboardId: z.string().uuid(),
  title: z.string().trim().max(100).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  players: z.array(roundPlayerInputSchema).min(1, "At least one player is required.")
});

export const updateRoundSchema = z.object({
  title: z.string().trim().max(100).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  players: z.array(roundPlayerInputSchema).min(1, "At least one player is required.")
});

export type CreateScoreboardInput = z.infer<typeof createScoreboardSchema>;
export type AddPlayerInput = z.infer<typeof addPlayerSchema>;
export type UpdateScoreboardPlayerInput = z.infer<typeof updateScoreboardPlayerSchema>;
export type CreateRoundInput = z.infer<typeof createRoundSchema>;
export type UpdateRoundInput = z.infer<typeof updateRoundSchema>;
