import type { ZodError } from "zod";

export type ActionResult<T = undefined> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export function actionError<T = undefined>(error: unknown): ActionResult<T> {
  if (error instanceof Error) {
    return { success: false, error: error.message };
  }

  return { success: false, error: "Something went wrong." };
}

export function validationError<T = undefined>(error: ZodError): ActionResult<T> {
  return {
    success: false,
    error: "Please check the highlighted fields.",
    fieldErrors: error.flatten().fieldErrors
  };
}
