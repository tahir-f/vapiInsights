import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, AlertCircle } from 'lucide-react';

export function StaffingPrediction() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Staffing Predictions</CardTitle>
        <CardDescription>Recommendations for the next 24 hours.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold">Predicted Peak Hours</p>
            <p className="text-2xl font-bold">2 PM - 5 PM</p>
            <p className="text-xs text-muted-foreground">Based on historical data</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="bg-accent/10 p-3 rounded-full">
            <TrendingUp className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="font-semibold">Recommended Agents</p>
            <p className="text-2xl font-bold">5 agents</p>
            <p className="text-xs text-muted-foreground">To maintain service levels</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
           <div className="bg-destructive/10 p-3 rounded-full">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <p className="font-semibold">Urgent Call Surge Alert</p>
            <p className="text-sm text-muted-foreground">A 15% increase in 'Urgent' tagged calls is predicted tomorrow morning.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
