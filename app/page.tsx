import { OverviewCards } from '@/components/dashboard/overview-cards';
import { CallDurationChart } from '@/components/dashboard/call-volume-chart';
import { SentimentTrendChart } from '@/components/dashboard/sentiment-trend-chart';
import { StaffingPrediction } from '@/components/dashboard/staffing-prediction';
import { RecentCalls } from '@/components/dashboard/recent-calls';
import { getCalls } from '@/lib/data';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default async function DashboardPage() {
  const calls = await getCalls();

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
         <div className="md:hidden">
          <SidebarTrigger />
        </div>
      </div>
      
      <OverviewCards calls={calls} />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <CallDurationChart />
        </div>
        <div className="lg:col-span-3">
          <SentimentTrendChart />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentCalls calls={calls.slice(0, 5)} />
        </div>
        <div>
          <StaffingPrediction />
        </div>
      </div>
    </div>
  );
}
