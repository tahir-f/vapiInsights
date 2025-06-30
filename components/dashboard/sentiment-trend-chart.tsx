"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { subDays, format } from "date-fns"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const today = new Date();
const chartData = Array.from({ length: 7 }).map((_, i) => {
  const date = subDays(today, 6 - i);
  return {
    date: format(date, 'yyyy-MM-dd'),
    // Using random data for demonstration
    positive: Math.floor(Math.random() * 5) + 3,
    negative: Math.floor(Math.random() * 3) + 1,
  };
});

const chartConfig = {
  positive: {
    label: "Positive",
    color: "hsl(var(--chart-1))",
  },
  negative: {
    label: "Negative",
    color: "hsl(var(--destructive))",
  },
}

export function SentimentTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Trend</CardTitle>
        <CardDescription>Positive vs. Negative calls this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
            />
            <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
             />
            <Tooltip content={<ChartTooltipContent />} />
            <Line
              dataKey="positive"
              type="monotone"
              stroke="var(--color-positive)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="negative"
              type="monotone"
              stroke="var(--color-negative)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
