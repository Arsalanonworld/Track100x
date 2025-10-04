'use server';

/**
 * @fileOverview AI-curated news feed for Pro users based on preferences and trending topics.
 *
 * - aiCuratedNewsFeedForProUsers - A function that generates an AI-curated news feed for Pro users.
 * - AICuratedNewsFeedInput - The input type for the aiCuratedNewsFeedForProUsers function.
 * - AICuratedNewsFeedOutput - The return type for the aiCuratedNewsFeedForProUsers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AICuratedNewsFeedInputSchema = z.object({
  userPreferences: z
    .string()
    .describe('The user preferences for crypto news, as a comma separated list of topics'),
  trendingCryptoTopics: z
    .string()
    .describe('The current trending crypto topics, as a comma separated list of topics'),
  numberOfArticles: z
    .number()
    .default(5)
    .describe('The number of news articles to return in the feed.'),
});
export type AICuratedNewsFeedInput = z.infer<typeof AICuratedNewsFeedInputSchema>;

const AICuratedNewsFeedOutputSchema = z.object({
  articles: z.array(
    z.object({
      title: z.string().describe('The title of the news article.'),
      summary: z.string().describe('A brief summary of the news article.'),
      url: z.string().url().describe('The URL of the news article.'),
    })
  ).describe('A list of AI-curated news articles.'),
});
export type AICuratedNewsFeedOutput = z.infer<typeof AICuratedNewsFeedOutputSchema>;

export async function aiCuratedNewsFeedForProUsers(
  input: AICuratedNewsFeedInput
): Promise<AICuratedNewsFeedOutput> {
  return aiCuratedNewsFeedForProUsersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCuratedNewsFeedPrompt',
  input: {schema: AICuratedNewsFeedInputSchema},
  output: {schema: AICuratedNewsFeedOutputSchema},
  prompt: `You are an AI news curator for a cryptocurrency news platform.

You will generate a news feed for a Pro user based on their preferences and the current trending crypto topics.

The user's preferences are: {{{userPreferences}}}

The current trending crypto topics are: {{{trendingCryptoTopics}}}

Generate a list of {{{numberOfArticles}}} news articles that are relevant to the user's preferences and the trending topics.

Each article should include a title, a brief summary, and a URL.

Output in JSON format.

Follow this schema: {{{outputSchema}}}`,
});

const aiCuratedNewsFeedForProUsersFlow = ai.defineFlow(
  {
    name: 'aiCuratedNewsFeedForProUsersFlow',
    inputSchema: AICuratedNewsFeedInputSchema,
    outputSchema: AICuratedNewsFeedOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
