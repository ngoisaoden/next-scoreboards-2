import { createScoreboard, updateScoreboard } from "@/actions/scoreboard.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ScoreboardFormProps = {
  scoreboard?: {
    id: string;
    name: string;
    description: string | null;
  };
};

export function ScoreboardForm({ scoreboard }: ScoreboardFormProps) {
  if (scoreboard) {
    return <EditScoreboardForm scoreboard={scoreboard} />;
  }

  return <CreateScoreboardForm />;
}

function CreateScoreboardForm() {
  async function action(formData: FormData) {
    "use server";
    await createScoreboard(formData);
  }

  return <ScoreboardFields title="New scoreboard" submitLabel="Create scoreboard" action={action} />;
}

function EditScoreboardForm({
  scoreboard
}: {
  scoreboard: {
    id: string;
    name: string;
    description: string | null;
  };
}) {
  const scoreboardId = scoreboard.id;

  async function action(formData: FormData) {
    "use server";
    await updateScoreboard(scoreboardId, formData);
  }

  return (
    <ScoreboardFields
      title="Edit scoreboard"
      submitLabel="Save changes"
      action={action}
      scoreboard={scoreboard}
    />
  );
}

function ScoreboardFields({
  title,
  submitLabel,
  action,
  scoreboard
}: {
  title: string;
  submitLabel: string;
  action: (formData: FormData) => Promise<void>;
  scoreboard?: {
    name: string;
    description: string | null;
  };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={scoreboard?.name} required maxLength={100} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={scoreboard?.description ?? ""} maxLength={500} />
          </div>
          <Button type="submit">{submitLabel}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
