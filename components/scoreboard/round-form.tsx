"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { createRound, updateRound } from "@/actions/round.actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type PlayerOption = {
  id: string;
  name: string;
  isActive: boolean;
};

type InitialRound = {
  id: string;
  title: string | null;
  notes: string | null;
  players: Array<{
    scoreboardPlayerId: string;
    score: number;
    placement: number | null;
  }>;
};

type RoundFormProps = {
  scoreboardId: string;
  players: PlayerOption[];
  initialRound?: InitialRound;
};

type PlayerEntryState = Record<
  string,
  {
    selected: boolean;
    score: string;
    placement: string;
  }
>;

export function RoundForm({ scoreboardId, players, initialRound }: RoundFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialRound?.title ?? "");
  const [notes, setNotes] = useState(initialRound?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const initialPlayerState = useMemo(() => {
    const selected = new Map(initialRound?.players.map((player) => [player.scoreboardPlayerId, player]));
    return players.reduce<PlayerEntryState>((state, player) => {
      const existing = selected.get(player.id);
      state[player.id] = {
        selected: Boolean(existing),
        score: existing ? String(existing.score) : "0",
        placement: existing?.placement ? String(existing.placement) : ""
      };
      return state;
    }, {});
  }, [initialRound, players]);

  const [entries, setEntries] = useState<PlayerEntryState>(initialPlayerState);

  function setEntry(playerId: string, patch: Partial<PlayerEntryState[string]>) {
    setEntries((current) => ({
      ...current,
      [playerId]: {
        ...current[playerId],
        ...patch
      }
    }));
  }

  const selectedPlayers = Object.entries(entries)
    .filter(([, entry]) => entry.selected)
    .map(([scoreboardPlayerId, entry]) => ({
      scoreboardPlayerId,
      score: Number(entry.score || 0),
      placement: entry.placement ? Number(entry.placement) : undefined
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialRound ? "Edit round" : "Create round"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            setError(null);

            const payload = {
              scoreboardId,
              title,
              notes,
              players: selectedPlayers
            };

            startTransition(async () => {
              const result = initialRound
                ? await updateRound(initialRound.id, {
                    title: payload.title,
                    notes: payload.notes,
                    players: payload.players
                  })
                : await createRound(payload);

              if (!result.success) {
                setError(result.error ?? "Unable to save round.");
                return;
              }

              if (!initialRound && result.data?.id) {
                router.push(`/scoreboards/${scoreboardId}/rounds/${result.data.id}`);
                return;
              }

              router.refresh();
            });
          }}
        >
          {error ? (
            <Alert className="border-destructive/50">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={100} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={1000} />
          </div>

          <div className="grid gap-3">
            <Label>Players and scores</Label>
            {players.length === 0 ? (
              <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                Add active players before creating a round.
              </p>
            ) : (
              players.map((player) => {
                const entry = entries[player.id];
                return (
                  <div
                    key={player.id}
                    className="grid gap-3 rounded-md border p-3 sm:grid-cols-[minmax(0,1fr)_120px_120px]"
                  >
                    <label className="flex min-w-0 items-center gap-3 text-sm font-medium">
                      <Checkbox
                        checked={entry.selected}
                        onCheckedChange={(checked) => setEntry(player.id, { selected: checked === true })}
                      />
                      <span className="truncate">
                        {player.name}
                        {!player.isActive ? <span className="ml-2 text-xs text-muted-foreground">inactive</span> : null}
                      </span>
                    </label>
                    <Input
                      aria-label={`${player.name} score`}
                      type="number"
                      step="1"
                      value={entry.score}
                      disabled={!entry.selected}
                      onChange={(event) => setEntry(player.id, { score: event.target.value })}
                    />
                    <Input
                      aria-label={`${player.name} placement`}
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Place"
                      value={entry.placement}
                      disabled={!entry.selected}
                      onChange={(event) => setEntry(player.id, { placement: event.target.value })}
                    />
                  </div>
                );
              })
            )}
          </div>

          <Button type="submit" disabled={isPending || players.length === 0}>
            <Save className="h-4 w-4" aria-hidden="true" />
            {isPending ? "Saving" : "Save round"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
