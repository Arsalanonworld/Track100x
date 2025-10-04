'use server';

import {
  generateInsightArticleTitles,
  type GenerateInsightArticleTitlesInput,
  type GenerateInsightArticleTitlesOutput,
} from '@/ai/flows/generate-insight-article-titles';

export async function generateInsightArticleAction(
  input: GenerateInsightArticleTitlesInput
): Promise<{ data: GenerateInsightArticleTitlesOutput | null; error: string | null }> {
  try {
    const output = await generateInsightArticleTitles(input);
    return { data: output, error: null };
  } catch (error) {
    console.error('Error generating insight article titles:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, error: errorMessage };
  }
}
