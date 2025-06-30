import { getCallById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { CallDetailView } from '@/components/calls/call-detail-view';
import { summarizeCallTranscript } from '@/ai/flows/summarize-call-transcript';
import { performSentimentAnalysis } from '@/ai/flows/perform-sentiment-analysis';
import { autoTagCall } from '@/ai/flows/auto-tag-calls';

type CallDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function CallDetailPage({ params }: CallDetailPageProps) {
  const call = await getCallById(params.id);

  if (!call) {
    notFound();
  }

  // Live AI calls to analyze the transcript
  const [summary, sentiment, tags] = await Promise.all([
    summarizeCallTranscript({ transcript: call.transcript.full }),
    performSentimentAnalysis({ transcript: call.transcript.full }),
    autoTagCall({ transcript: call.transcript.full }),
  ]);


  return (
    <CallDetailView 
        call={call}
        summary={summary}
        sentiment={sentiment}
        tags={tags}
    />
  );
}
