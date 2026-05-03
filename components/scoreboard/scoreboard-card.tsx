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
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="leading-snug">{scoreboard.name}</CardTitle>
          <Trophy className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        </div>
        {scoreboard.description ? <p className="text-sm text-muted-foreground">{scoreboard.description}</p> : null}
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Badge variant="secondary">{scoreboard._count.players} players</Badge>
        <Badge variant="outline">{scoreboard._count.rounds} rounds</Badge>
        <span className="text-sm text-muted-foreground">Updated {formatDate(scoreboard.updatedAt)}</span>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/scoreboards/${scoreboard.id}`}>Open</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
