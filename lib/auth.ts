import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { db } from "@/lib/db";
import { createSupabaseServerClient, hasSupabaseConfig } from "@/lib/supabase/server";

export async function getUser(): Promise<User | null> {
  if (!hasSupabaseConfig()) return null;

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) return null;
  return user;
}

export async function requireUser() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireScoreboardAccess(userId: string, scoreboardId: string) {
  const scoreboard = await db.scoreboard.findFirst({
    where: {
      id: scoreboardId,
      ownerUserId: userId
    }
  });

  if (!scoreboard) {
    throw new Error("You do not have access to this scoreboard.");
  }

  return scoreboard;
}
