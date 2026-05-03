"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient, hasSupabaseConfig } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

export async function login(_previousState: ActionResult, formData: FormData): Promise<ActionResult> {
  if (!hasSupabaseConfig()) {
    return {
      success: false,
      error: "Supabase is not configured. Add the required environment variables before logging in."
    };
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return { success: false, error: error.message };
  }

  redirect("/scoreboards");
}

export async function signUp(_previousState: ActionResult, formData: FormData): Promise<ActionResult> {
  if (!hasSupabaseConfig()) {
    return {
      success: false,
      error: "Supabase is not configured. Add the required environment variables before signing up."
    };
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    data: undefined
  };
}

export async function logout() {
  if (hasSupabaseConfig()) {
    const supabase = createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  redirect("/login");
}
