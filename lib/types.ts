export type Call = {
  id: string;
  timestamp: string;
  agent: {
    id: string;
    confidence: number;
  };
  user: {
    id: string;
    location: string;
    language: string;
  };
  transcript: {
    full: string;
    summary: string;
  };
  duration: number; // in seconds
  successful: boolean;
  intent: 'Order' | 'Complaint' | 'Query' | 'Other';
  sentiment: {
    score: number;
    overall: 'Positive' | 'Negative' | 'Neutral' | 'Unanalyzed';
    keywords: string[];
  };
  tags: ('Urgent' | 'Complaint' | 'Order' | 'Query')[];
  urgencyLevel: 'High' | 'Medium' | 'Low';
};
