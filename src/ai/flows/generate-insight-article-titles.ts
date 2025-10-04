'use server';

/**
 * @fileOverview Generates insight article titles and content ideas based on trending whale transactions and wallet activities.
 *
 * - generateInsightArticleTitles - A function that generates insight article titles and content ideas.
 * - GenerateInsightArticleTitlesInput - The input type for the generateInsightArticleTitles function.
 * - GenerateInsightArticleTitlesOutput - The return type for the generateInsightArticleTitles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInsightArticleTitlesInputSchema = z.object({
  trendingTransactions: z
    .string()
    .describe(
      'A description of the trending whale transactions and wallet activities.'
    ),
});
export type GenerateInsightArticleTitlesInput = z.infer<
  typeof GenerateInsightArticleTitlesInputSchema
>;

const GenerateInsightArticleTitlesOutputSchema = z.object({
  articleTitle: z.string().describe('A suggested title for the article.'),
  contentIdeas: z.string().describe('Suggested content ideas for the article.'),
});
export type GenerateInsightArticleTitlesOutput = z.infer<
  typeof GenerateInsightArticleTitlesOutputSchema
>;

export async function generateInsightArticleTitles(
  input: GenerateInsightArticleTitlesInput
): Promise<GenerateInsightArticleTitlesOutput> {
  return generateInsightArticleTitlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInsightArticleTitlesPrompt',
  input: {schema: GenerateInsightArticleTitlesInputSchema},
  output: {schema: GenerateInsightArticleTitlesOutputSchema},
  prompt: `You are a content creator specializing in cryptocurrency market analysis.

You will use this information to generate a title and content ideas for an article.

Trending Whale Transactions and Wallet Activities: {{{trendingTransactions}}}

Respond with a title suggestion and several content ideas. Be brief.

{{output}}`,
});

const generateInsightArticleTitlesFlow = ai.defineFlow(
  {
    name: 'generateInsightArticleTitlesFlow',
    inputSchema: GenerateInsightArticleTitlesInputSchema,
    outputSchema: GenerateInsightArticleTitlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
