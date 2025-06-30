import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { Call } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

type RecentCallsProps = {
  calls: Call[];
};

const sentimentBadgeVariant = {
  Positive: 'default',
  Negative: 'destructive',
  Neutral: 'secondary',
  Unanalyzed: 'secondary',
} as const;

export function RecentCalls({ calls }: RecentCallsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle>Recent Calls</CardTitle>
            <CardDescription>
                An overview of the most recent conversations.
            </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/calls">
                View All
                <ArrowRight className="h-4 w-4" />
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Intent</TableHead>
              <TableHead>Sentiment</TableHead>
              <TableHead className="text-right">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calls.map(call => (
              <TableRow key={call.id} className="cursor-pointer">
                <TableCell>
                  <Link href={`/calls/${call.id}`} className="block">
                    <div className="font-medium">{call.user.id}</div>
                    <div className="text-sm text-muted-foreground">{call.user.location}</div>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/calls/${call.id}`} className="block">
                    {call.intent}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/calls/${call.id}`} className="block">
                    <Badge variant={sentimentBadgeVariant[call.sentiment.overall]}>
                      {call.sentiment.overall}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/calls/${call.id}`} className="block">
                    {call.duration}s
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
