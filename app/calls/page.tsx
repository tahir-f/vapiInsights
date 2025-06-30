import { getCalls } from '@/lib/data';
import { CallsTable } from '@/components/calls/calls-table';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default async function CallsPage() {
  const calls = await getCalls();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Call Explorer</h1>
          <p className="text-muted-foreground">
            Search, filter, and analyze all call transcripts.
          </p>
        </div>
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
      </div>
      <CallsTable calls={calls} />
    </div>
  );
}
