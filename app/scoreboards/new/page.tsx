import Link from "next/link";
import { ScoreboardForm } from "@/components/scoreboard/scoreboard-form";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";

export default async function NewScoreboardPage() {
  await requireUser();

  return (
    <div className="page-shell max-w-3xl">
      <div>
        <Button asChild variant="link" className="px-0">
          <Link href="/scoreboards">Back to scoreboards</Link>
        </Button>
        <h1 className="text-3xl font-semibold tracking-normal">Create scoreboard</h1>
      </div>
      <ScoreboardForm />
    </div>
  );
}
