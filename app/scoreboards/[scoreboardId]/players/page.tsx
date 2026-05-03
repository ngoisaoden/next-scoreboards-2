import Link from "next/link";
import { deactivateScoreboardPlayer, updateScoreboardPlayer } from "@/actions/player.actions";
import { PlayerForm } from "@/components/scoreboard/player-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireUser } from "@/lib/auth";
import { listPlayersForScoreboard } from "@/services/player.service";
import { getScoreboardForUser } from "@/services/scoreboard.service";

export default async function PlayersPage({ params }: { params: { scoreboardId: string } }) {
  const user = await requireUser();
  const [scoreboard, players] = await Promise.all([
    getScoreboardForUser(params.scoreboardId, user.id),
    listPlayersForScoreboard(params.scoreboardId, user.id)
  ]);

  return (
    <div className="page-shell">
      <div>
        <Button asChild variant="link" className="px-0">
          <Link href={`/scoreboards/${scoreboard.id}`}>Back to scoreboard</Link>
        </Button>
        <h1 className="text-3xl font-semibold tracking-normal">Players</h1>
        <p className="text-muted-foreground">{scoreboard.name}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <PlayerForm scoreboardId={scoreboard.id} />
        <Card>
          <CardHeader>
            <CardTitle>Roster</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {players.length === 0 ? (
              <p className="text-sm text-muted-foreground">No players added yet.</p>
            ) : (
              players.map((membership) => (
                <div key={membership.id} className="grid gap-3 rounded-md border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">{membership.nickname || membership.player.displayName}</p>
                      <p className="text-sm text-muted-foreground">{membership.player.displayName}</p>
                    </div>
                    <Badge variant={membership.isActive ? "secondary" : "outline"}>
                      {membership.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <form
                    action={async (formData: FormData) => {
                      "use server";
                      await updateScoreboardPlayer(membership.id, formData);
                    }}
                    className="grid gap-3 sm:grid-cols-2"
                  >
                    <div className="grid gap-2">
                      <Label htmlFor={`displayName-${membership.id}`}>Name</Label>
                      <Input
                        id={`displayName-${membership.id}`}
                        name="displayName"
                        defaultValue={membership.player.displayName}
                        maxLength={80}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`nickname-${membership.id}`}>Nickname</Label>
                      <Input
                        id={`nickname-${membership.id}`}
                        name="nickname"
                        defaultValue={membership.nickname ?? ""}
                        maxLength={80}
                      />
                    </div>
                    <div className="flex gap-2 sm:col-span-2">
                      <Button type="submit" variant="outline">
                        Save player
                      </Button>
                      {membership.isActive ? (
                        <Button
                          formAction={async () => {
                            "use server";
                            await deactivateScoreboardPlayer(membership.id);
                          }}
                          variant="destructive"
                        >
                          Deactivate
                        </Button>
                      ) : null}
                    </div>
                  </form>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
