import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";

function loadEnvFile(path: string) {
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] ??= value;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

function getRequiredEnv(key: string) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Set ${key} before seeding the demo user.`);
  }

  return value;
}

const DEMO_EMAIL = getRequiredEnv("DEMO_EMAIL");
const DEMO_PASSWORD = getRequiredEnv("DEMO_PASSWORD");

async function findUserByEmail(email: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before seeding the demo user.");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 100
    });

    if (error) throw error;

    const user = data.users.find((candidate) => candidate.email?.toLowerCase() === email.toLowerCase());
    if (user) return { supabase, user };
    if (data.users.length < 100) break;
  }

  return { supabase, user: null };
}

async function upsertDemoAuthUser() {
  const { supabase, user } = await findUserByEmail(DEMO_EMAIL);

  if (user) {
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true
    });

    if (error) throw error;
    console.log(`Updated demo auth user: ${DEMO_EMAIL}`);
    return data.user;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    email_confirm: true
  });

  if (error) throw error;
  console.log(`Created demo auth user: ${DEMO_EMAIL}`);
  return data.user;
}

async function main() {
  await upsertDemoAuthUser();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
