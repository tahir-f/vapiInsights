"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { day: 'Monday', minutes: 186 },
  { day: 'Tuesday', minutes: 305 },
  { day: 'Wednesday', minutes: 237 },
  { day: 'Thursday', minutes: 273 },
  { day: 'Friday', minutes: 209 },
  { day: 'Saturday', minutes: 98 },
  { day: 'Sunday', minutes: 78 },
];

export function CallDurationChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Call Duration</CardTitle>
        <CardDescription>Total call minutes this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[300px] w-full">
            <BarChart data={chartData} accessibilityLayer>
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={4} />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
