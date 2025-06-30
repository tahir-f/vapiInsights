// SummarizeCallTranscript.ts
'use server';

/**
 * @fileOverview This file contains a Genkit flow for summarizing call transcripts.
 *
 * - summarizeCallTranscript - A function that summarizes a call transcript.
 * - SummarizeCallTranscriptInput - The input type for the summarizeCallTranscript function.
 * - SummarizeCallTranscriptOutput - The return type for the summarizeCallTranscript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCallTranscriptInputSchema = z.object({
  transcript: z
    .string()
    .describe('The full transcript of the call to be summarized.'),
});
export type SummarizeCallTranscriptInput = z.infer<
  typeof SummarizeCallTranscriptInputSchema
>;

const SummarizeCallTranscriptOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the call transcript.'),
});
export type SummarizeCallTranscriptOutput = z.infer<
  typeof SummarizeCallTranscriptOutputSchema
>;

export async function summarizeCallTranscript(
  input: SummarizeCallTranscriptInput
): Promise<SummarizeCallTranscriptOutput> {
  return summarizeCallTranscriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCallTranscriptPrompt',
  input: {schema: SummarizeCallTranscriptInputSchema},
  output: {schema: SummarizeCallTranscriptOutputSchema},
  prompt: `Summarize the following call transcript. Be concise and focus on the main points of the conversation.\n\nTranscript: {{{transcript}}}`,
});

const summarizeCallTranscriptFlow = ai.defineFlow(
  {
    name: 'summarizeCallTranscriptFlow',
    inputSchema: SummarizeCallTranscriptInputSchema,
    outputSchema: SummarizeCallTranscriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
