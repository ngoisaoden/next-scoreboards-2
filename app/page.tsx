import Link from "next/link";
import { ArrowRight, ListChecks, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getUser();

  return (
    <div className="page-shell">
      <section className="grid min-h-[calc(100vh-9rem)] content-center gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="grid gap-5">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-primary">Card game scoring</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-normal sm:text-5xl">
            Track rounds, rotating players, and leaderboards without a spreadsheet.
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Create a scoreboard for each table, add players, score every round, and let the leaderboard update from the
            saved history.
          </p>
          <div>
            <Button asChild size="lg">
              <Link href={user ? "/scoreboards" : "/login"}>
                {user ? "Open scoreboards" : "Log in to start"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-4">
          <Card>
            <CardContent className="grid gap-4 p-5">
              <div className="flex items-center gap-3">
                <UsersRound className="h-5 w-5 text-primary" aria-hidden="true" />
                <div>
                  <p className="font-medium">Different players each round</p>
                  <p className="text-sm text-muted-foreground">Select only the participants who played.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ListChecks className="h-5 w-5 text-primary" aria-hidden="true" />
                <div>
                  <p className="font-medium">Positive and negative scores</p>
                  <p className="text-sm text-muted-foreground">Totals are calculated directly from round entries.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
