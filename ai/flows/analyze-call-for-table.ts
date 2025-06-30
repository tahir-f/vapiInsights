'use server';

/**
 * @fileOverview Analyzes call transcripts for table display, providing sentiment and tags.
 *
 * - analyzeCallForTable - A function that handles the call analysis.
 * - AnalyzeCallForTableInput - The input type for the analyzeCallForTable function.
 * - AnalyzeCallForTableOutput - The return type for the analyzeCallForTable function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCallForTableInputSchema = z.object({
  transcript: z.string().describe('The call transcript to analyze.'),
});
export type AnalyzeCallForTableInput = z.infer<typeof AnalyzeCallForTableInputSchema>;

const AnalyzeCallForTableOutputSchema = z.object({
  overallSentiment: z
    .string()
    .describe('The overall sentiment of the call (positive, negative, neutral).'),
  sentimentScore: z
    .number()
    .describe('A numerical score representing the sentiment, where 1 is positive and -1 is negative.'),
  emotionalKeywords: z.array(z.string()).describe('A list of keywords associated with the emotions expressed in the call.'),
  tags: z
    .array(z.enum(['complaint', 'urgent', 'query', 'order', 'other']))
    .describe('The tags for the call transcript.'),
  urgencyLevel: z
    .string()
    .describe('The urgency level of the call (high, medium, low).'),
});
export type AnalyzeCallForTableOutput = z.infer<typeof AnalyzeCallForTableOutputSchema>;

export async function analyzeCallForTable(input: AnalyzeCallForTableInput): Promise<AnalyzeCallForTableOutput> {
  return analyzeCallForTableFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzeCallForTablePrompt',
  input: {schema: AnalyzeCallForTableInputSchema},
  output: {schema: AnalyzeCallForTableOutputSchema},
  prompt: `Analyze the following call transcript and determine the overall sentiment, sentiment score, emotional keywords, tags, and urgency level.

Transcript: {{{transcript}}}

- Sentiment scores should be between 1 and -1 (1=positive, -1=negative, 0=neutral).
- Overall sentiment should be 'positive', 'negative', or 'neutral'.
- Tags should be an array containing one or more of: 'complaint', 'urgent', 'query', 'order', 'other'.
- Urgency level should be 'high', 'medium', or 'low'.

Output the results in the specified JSON format.
`,
});

const analyzeCallForTableFlow = ai.defineFlow(
  {
    name: 'analyzeCallForTableFlow',
    inputSchema: AnalyzeCallForTableInputSchema,
    outputSchema: AnalyzeCallForTableOutputSchema,
  },
  async input => {
    const {output} = await analysisPrompt(input);
    return output!;
  }
);
