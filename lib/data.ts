import type { Call } from './types';
import { analyzeCallForTable } from '@/ai/flows/analyze-call-for-table';

// A helper function to add a delay, preventing API rate limit errors.
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getDuration = (call: any): number => {
  if (call.duration) {
    return Math.round(call.duration);
  }
  if (call.endedAt && call.startedAt) {
    return Math.round(
      (new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000
    );
  }
  return 0;
};

// This helper function maps a Vapi call object to our app's Call type.
// It's used when fetching a single call, where the detail page will run its own fresh AI analysis.
const mapVapiCallToAppCall = (vapiCall: any): Call => {
  return {
    id: vapiCall.id,
    timestamp: vapiCall.createdAt,
    agent: {
      id: vapiCall.assistantId || 'Unknown Agent',
      confidence: 0.9, // Vapi doesn't provide this; using a placeholder.
    },
    user: {
      id: vapiCall.customer?.number || 'Unknown User',
      location: 'Unknown Location', // Not available from Vapi
      language: vapiCall.language || 'en-US',
    },
    transcript: {
      full: vapiCall.transcript || '',
      summary: vapiCall.summary || '',
    },
    duration: getDuration(vapiCall),
    successful: vapiCall.status === 'ended' && vapiCall.endedReason !== 'error',
    // Default values for AI-derived fields.
    // The detail page will generate real-time values.
    intent: 'Query',
    sentiment: {
      score: 0,
      overall: 'Neutral',
      keywords: [],
    },
    tags: [],
    urgencyLevel: 'Low',
  };
};

export async function getCalls(): Promise<Call[]> {
  if (!process.env.VAPI_API_KEY) {
    console.error('VAPI_API_KEY is not set. Returning empty array.');
    return [];
  }

  const response = await fetch('https://api.vapi.ai/call?limit=20', {
    headers: {
      Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
    },
    cache: 'no-store', // Ensures fresh data on every fetch
  });

  if (!response.ok) {
    console.error('Failed to fetch calls from Vapi:', await response.text());
    return [];
  }

  const vapiCalls: any[] = await response.json();
  const calls: Call[] = [];
  const callsToAnalyze = 3;

  for (let i = 0; i < vapiCalls.length; i++) {
    const vapiCall = vapiCalls[i];
    const transcript = vapiCall.transcript || '';
    const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

    let call: Call;

    if (i < callsToAnalyze && transcript) {
      // This is a recent call with a transcript, let's analyze it.
      let analysisResult;
      try {
        analysisResult = await analyzeCallForTable({ transcript });
        await delay(1100); 
      } catch (error) {
        console.error(`AI analysis failed for call ${vapiCall.id}:`, error);
        analysisResult = {
          overallSentiment: 'neutral',
          sentimentScore: 0,
          emotionalKeywords: [],
          tags: ['other'],
          urgencyLevel: 'low',
        };
      }
      
      const capitalizedTags = analysisResult.tags.map(capitalize);
      const intent = (capitalizedTags.find(t => ['Order', 'Complaint', 'Query'].includes(t)) as Call['intent']) || 'Other';
      const tagsForCall = capitalizedTags.filter(t => ['Urgent', 'Complaint', 'Order', 'Query'].includes(t)) as Call['tags'];

      call = {
        id: vapiCall.id,
        timestamp: vapiCall.createdAt,
        agent: { id: vapiCall.assistantId || 'Unknown Agent', confidence: 0.9 },
        user: { id: vapiCall.customer?.number || 'Unknown User', location: 'Unknown Location', language: vapiCall.language || 'en-US' },
        transcript: { full: transcript, summary: vapiCall.summary || '' },
        duration: getDuration(vapiCall),
        successful: vapiCall.status === 'ended' && vapiCall.endedReason !== 'error',
        intent: intent,
        sentiment: {
          score: analysisResult.sentimentScore,
          overall: capitalize(analysisResult.overallSentiment) as Call['sentiment']['overall'],
          keywords: analysisResult.emotionalKeywords,
        },
        tags: tagsForCall,
        urgencyLevel: capitalize(analysisResult.urgencyLevel) as Call['urgencyLevel'],
      };
    } else {
      // This is an older call, or one without a transcript. We won't analyze it.
      call = {
        id: vapiCall.id,
        timestamp: vapiCall.createdAt,
        agent: { id: vapiCall.assistantId || 'Unknown Agent', confidence: 0.9 },
        user: { id: vapiCall.customer?.number || 'Unknown User', location: 'Unknown Location', language: vapiCall.language || 'en-US' },
        transcript: { full: transcript, summary: vapiCall.summary || '' },
        duration: getDuration(vapiCall),
        successful: vapiCall.status === 'ended' && vapiCall.endedReason !== 'error',
        intent: 'Other',
        sentiment: {
          score: 0,
          overall: 'Unanalyzed',
          keywords: [],
        },
        tags: [],
        urgencyLevel: 'Low',
      };
    }
    calls.push(call);
  }

  return calls.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function getCallById(id: string): Promise<Call | undefined> {
  if (!process.env.VAPI_API_KEY) {
    console.error('VAPI_API_KEY is not set.');
    return undefined;
  }
  
  const response = await fetch(`https://api.vapi.ai/call/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
    },
    cache: 'no-store', // Ensures fresh data on every fetch
  });

  if (!response.ok) {
    console.error(`Failed to fetch call ${id} from Vapi:`, await response.text());
    return undefined;
  }

  const vapiCall = await response.json();
  return mapVapiCallToAppCall(vapiCall);
}
