// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview Performs sentiment analysis on call transcripts and visualizes sentiment trends over time.
 *
 * - performSentimentAnalysis - A function that handles sentiment analysis of call transcripts.
 * - PerformSentimentAnalysisInput - The input type for the performSentimentAnalysis function.
 * - PerformSentimentAnalysisOutput - The return type for the performSentimentAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PerformSentimentAnalysisInputSchema = z.object({
  transcript: z.string().describe('The call transcript to analyze.'),
});
export type PerformSentimentAnalysisInput = z.infer<typeof PerformSentimentAnalysisInputSchema>;

const PerformSentimentAnalysisOutputSchema = z.object({
  overallSentiment: z
    .string()
    .describe('The overall sentiment of the call (positive, negative, neutral).'),
  sentimentScore: z
    .number()
    .describe('A numerical score representing the sentiment, where 1 is positive and -1 is negative.'),
  emotionalKeywords: z.array(z.string()).describe('A list of keywords associated with the emotions expressed in the call.'),
});
export type PerformSentimentAnalysisOutput = z.infer<typeof PerformSentimentAnalysisOutputSchema>;

export async function performSentimentAnalysis(input: PerformSentimentAnalysisInput): Promise<PerformSentimentAnalysisOutput> {
  return performSentimentAnalysisFlow(input);
}

const sentimentAnalysisPrompt = ai.definePrompt({
  name: 'sentimentAnalysisPrompt',
  input: {schema: PerformSentimentAnalysisInputSchema},
  output: {schema: PerformSentimentAnalysisOutputSchema},
  prompt: `Analyze the following call transcript and determine the overall sentiment, sentiment score, and emotional keywords.

Transcript: {{{transcript}}}

Consider the following when providing sentiment score:
- Sentiment scores should be between 1 and -1
- 1 indicates very positive sentiment
- -1 indicates very negative sentiment
- 0 indicates neutral sentiment

Output the overall sentiment as either 'positive', 'negative', or 'neutral'.
Provide a list of keywords associated with the emotions expressed in the call.
`,
});

const performSentimentAnalysisFlow = ai.defineFlow(
  {
    name: 'performSentimentAnalysisFlow',
    inputSchema: PerformSentimentAnalysisInputSchema,
    outputSchema: PerformSentimentAnalysisOutputSchema,
  },
  async input => {
    const {output} = await sentimentAnalysisPrompt(input);
    return output!;
  }
);
