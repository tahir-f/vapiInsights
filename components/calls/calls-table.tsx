'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Call } from '@/lib/types';
import { Smile, Meh, Frown, AlertTriangle, Sparkles, Check, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const sentimentIcons = {
  Positive: <Smile className="h-5 w-5 text-green-500" />,
  Negative: <Frown className="h-5 w-5 text-red-500" />,
  Neutral: <Meh className="h-5 w-5 text-yellow-500" />,
  Unanalyzed: <HelpCircle className="h-5 w-5 text-gray-500" />,
};

type CallsTableProps = {
  calls: Call[];
};

export function CallsTable({ calls: initialCalls }: CallsTableProps) {
  const [calls, setCalls] = React.useState(initialCalls);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [intentFilter, setIntentFilter] = React.useState('all');
  const [urgencyFilter, setUrgencyFilter] = React.useState('all');
  const { toast } = useToast();

  React.useEffect(() => {
    setCalls(initialCalls);
  }, [initialCalls]);

  const handleTagAction = (callId: string, tag: Call['tags'][number]) => {
    setCalls(currentCalls =>
      currentCalls.map(call => {
        if (call.id === callId && !call.tags.includes(tag)) {
          return { ...call, tags: [...call.tags, tag] };
        }
        return call;
      })
    );

    toast({
      title: `Tag Applied`,
      description: `Tag '${tag}' has been applied to call ${callId}.`,
    });
  };

  const filteredCalls = React.useMemo(() => {
    return calls
      .filter(call => {
        const searchLower = searchTerm.toLowerCase();
        return (
          call.id.toLowerCase().includes(searchLower) ||
          call.user.id.toLowerCase().includes(searchLower) ||
          call.transcript.full.toLowerCase().includes(searchLower)
        );
      })
      .filter(call => intentFilter === 'all' || call.intent === intentFilter)
      .filter(call => urgencyFilter === 'all' || call.urgencyLevel === urgencyFilter);
  }, [calls, searchTerm, intentFilter, urgencyFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          placeholder="Search by ID, user, or transcript..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-4">
          <Select value={intentFilter} onValueChange={setIntentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Intent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Intents</SelectItem>
              <SelectItem value="Order">Order</SelectItem>
              <SelectItem value="Complaint">Complaint</SelectItem>
              <SelectItem value="Query">Query</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Urgencies</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Call ID</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Sentiment</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>AI Suggestions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCalls.map(call => {
              const showComplaintButton = call.intent === 'Complaint' && !call.tags.includes('Complaint');
              const showUrgentButton = call.urgencyLevel === 'High' && !call.tags.includes('Urgent');

              return (
              <TableRow key={call.id}>
                <TableCell>
                  <Link href={`/calls/${call.id}`} className="font-medium text-primary hover:underline">
                    {call.id}
                  </Link>
                  <div className="text-sm text-muted-foreground">{call.user.id}</div>
                </TableCell>
                <TableCell>{new Date(call.timestamp).toLocaleString()}</TableCell>
                <TableCell>{sentimentIcons[call.sentiment.overall]}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {call.tags.map(tag => (
                      <Badge key={tag} variant={tag === 'Urgent' || tag === 'Complaint' ? 'destructive' : 'secondary'}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {showComplaintButton && (
                    <Button size="sm" variant="outline" onClick={() => handleTagAction(call.id, 'Complaint')}>
                      <Sparkles className="mr-2 h-4 w-4" /> Tag as Complaint
                    </Button>
                  )}
                  {showUrgentButton && (
                     <Button size="sm" variant="destructive" className="ml-2" onClick={() => handleTagAction(call.id, 'Urgent')}>
                      <AlertTriangle className="mr-2 h-4 w-4" /> Tag as Urgent
                    </Button>
                  )}
                   {!showComplaintButton && !showUrgentButton && (
                     <span className="text-sm text-muted-foreground flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" /> No actions</span>
                  )}
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
