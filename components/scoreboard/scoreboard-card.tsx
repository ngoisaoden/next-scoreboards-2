import Link from "next/link";
import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

type ScoreboardCardProps = {
  scoreboard: {
    id: string;
    name: string;
    description: string | null;
    updatedAt: Date;
    _count: {
      players: number;
      rounds: number;
    };
  };
};

export function ScoreboardCard({ scoreboard }: ScoreboardCardProps) {
  return (
    <Card className="min-w-0 max-w-full overflow-hidden">
      <CardHeader>
        <div className="flex min-w-0 items-start justify-between gap-3">
          <CardTitle className="min-w-0 break-words leading-snug">{scoreboard.name}</CardTitle>
          <Trophy className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        </div>
        {scoreboard.description ? (
          <p className="break-words text-sm text-muted-foreground">{scoreboard.description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="flex min-w-0 flex-wrap gap-2">
        <Badge variant="secondary">{scoreboard._count.players} players</Badge>
        <Badge variant="outline">{scoreboard._count.rounds} rounds</Badge>
        <span className="min-w-0 break-words text-sm text-muted-foreground">
          Updated {formatDate(scoreboard.updatedAt)}
        </span>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full sm:w-auto">
          <Link href={`/scoreboards/${scoreboard.id}`}>Open</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
