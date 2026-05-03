import { redirect } from "next/navigation";
import { LoginForm } from "@/components/scoreboard/login-form";
import { getUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getUser();

  if (user) {
    redirect("/scoreboards");
  }

  return (
    <div className="page-shell">
      <LoginForm />
    </div>
  );
}
