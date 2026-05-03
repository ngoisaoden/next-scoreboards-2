"use client";

import { useRef, useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { addPlayerToScoreboard } from "@/actions/player.actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PlayerForm({ scoreboardId }: { scoreboardId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      className="grid gap-4 rounded-lg border bg-card p-5"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setError(null);
        startTransition(async () => {
          const result = await addPlayerToScoreboard(formData);
          if (!result.success) {
            setError(result.error ?? "Unable to add player.");
            return;
          }
          formRef.current?.reset();
        });
      }}
    >
      <input type="hidden" name="scoreboardId" value={scoreboardId} />
      {error ? (
        <Alert className="border-destructive/50">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <div className="grid gap-2">
        <Label htmlFor="displayName">Player name</Label>
        <Input id="displayName" name="displayName" required maxLength={80} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="nickname">Nickname</Label>
        <Input id="nickname" name="nickname" maxLength={80} />
      </div>
      <Button type="submit" disabled={isPending}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        {isPending ? "Adding" : "Add player"}
      </Button>
    </form>
  );
}
