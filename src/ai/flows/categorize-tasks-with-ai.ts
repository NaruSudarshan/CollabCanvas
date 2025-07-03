'use server';
/**
 * @fileOverview An AI agent to categorize tasks based on their descriptions and content.
 *
 * - categorizeTask - A function that handles the task categorization process.
 * - CategorizeTaskInput - The input type for the categorizeTask function.
 * - CategorizeTaskOutput - The return type for the categorizeTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeTaskInputSchema = z.object({
  taskDescription: z
    .string()
    .describe('The description of the task to be categorized.'),
  taskContent: z
    .string()
    .describe('The content of the task, providing more context.'),
});
export type CategorizeTaskInput = z.infer<typeof CategorizeTaskInputSchema>;

const CategorizeTaskOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'The predicted category for the task (e.g., "Meeting", "Marketing", "Development").'
    ),
  priority: z
    .string()
    .describe(
      'The suggested priority level for the task (e.g., "High", "Medium", "Low").'
    ),
  reasoning: z
    .string()
    .describe(
      'Explanation of why the task was categorized and prioritized this way.'
    ),
});
export type CategorizeTaskOutput = z.infer<typeof CategorizeTaskOutputSchema>;

export async function categorizeTask(input: CategorizeTaskInput): Promise<CategorizeTaskOutput> {
  return categorizeTaskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeTaskPrompt',
  input: {schema: CategorizeTaskInputSchema},
  output: {schema: CategorizeTaskOutputSchema},
  prompt: `You are an AI assistant designed to categorize and prioritize tasks based on their description and content.\n\nGiven the following task description and content, determine the most appropriate category and priority level.\nExplain your reasoning for the chosen category and priority.\n\nTask Description: {{{taskDescription}}}\nTask Content: {{{taskContent}}}\n\nRespond with a JSON object that looks like this:\n{
  "category": "The predicted category for the task",
  "priority": "The suggested priority level for the task",
  "reasoning": "Explanation of why the task was categorized and prioritized this way."
}`,
});

const categorizeTaskFlow = ai.defineFlow(
  {
    name: 'categorizeTaskFlow',
    inputSchema: CategorizeTaskInputSchema,
    outputSchema: CategorizeTaskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
