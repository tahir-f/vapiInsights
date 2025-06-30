import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-call-transcript.ts';
import '@/ai/flows/auto-tag-calls.ts';
import '@/ai/flows/perform-sentiment-analysis.ts';
import '@/ai/flows/analyze-call-for-table.ts';
