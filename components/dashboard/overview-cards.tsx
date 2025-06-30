import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle, Phone, TrendingUp } from 'lucide-react';
import type { Call } from '@/lib/types';

type OverviewCardsProps = {
  calls: Call[];
};

export function OverviewCards({ calls }: OverviewCardsProps) {
  const totalCalls = calls.length;
  const totalDuration = calls.reduce((acc, call) => acc + call.duration, 0);
  const avgDuration = totalCalls > 0 ? (totalDuration / totalCalls).toFixed(0) : 0;
  const successfulCalls = calls.filter(call => call.successful).length;
  const successRate = totalCalls > 0 ? ((successfulCalls / totalCalls) * 100).toFixed(0) : 0;
  const avgConfidence = totalCalls > 0 ? (calls.reduce((acc, call) => acc + call.agent.confidence, 0) / totalCalls * 100).toFixed(0) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCalls}</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgDuration}s</div>
          <p className="text-xs text-muted-foreground">+5s from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successRate}%</div>
          <p className="text-xs text-muted-foreground">+2.5% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. AI Confidence</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgConfidence}%</div>
          <p className="text-xs text-muted-foreground">Maintained from last month</p>
        </CardContent>
      </Card>
    </div>
  );
}
