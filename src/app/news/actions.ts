'use server';

import {
  aiCuratedNewsFeedForProUsers,
  type AICuratedNewsFeedInput,
  type AICuratedNewsFeedOutput,
} from '@/ai/flows/ai-curated-news-feed-for-pro-users';

export async function generateNewsFeedAction(
  input: AICuratedNewsFeedInput
): Promise<{ data: AICuratedNewsFeedOutput | null; error: string | null }> {
  try {
    const output = await aiCuratedNewsFeedForProUsers(input);
    return { data: output, error: null };
  } catch (error) {
    console.error('Error generating news feed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, error: errorMessage };
  }
}
