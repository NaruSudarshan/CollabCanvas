'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting the most suitable project template
 * based on the content the user is working on.
 *
 * - suggestOptimalTemplate - A function that suggests the optimal template.
 * - SuggestOptimalTemplateInput - The input type for the suggestOptimalTemplate function.
 * - SuggestOptimalTemplateOutput - The return type for the suggestOptimalTemplate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalTemplateInputSchema = z.object({
  content: z
    .string()
    .describe('The content the user is working on, e.g., a document or task description.'),
});

export type SuggestOptimalTemplateInput = z.infer<typeof SuggestOptimalTemplateInputSchema>;

const SuggestOptimalTemplateOutputSchema = z.object({
  templateSuggestion: z
    .string()
    .describe('The suggested project template, e.g., meeting agenda, marketing plan.'),
  reasoning: z
    .string()
    .describe('The AI reasoning behind the template suggestion, explaining why it is suitable.'),
});

export type SuggestOptimalTemplateOutput = z.infer<typeof SuggestOptimalTemplateOutputSchema>;

export async function suggestOptimalTemplate(
  input: SuggestOptimalTemplateInput
): Promise<SuggestOptimalTemplateOutput> {
  return suggestOptimalTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalTemplatePrompt',
  input: {schema: SuggestOptimalTemplateInputSchema},
  output: {schema: SuggestOptimalTemplateOutputSchema},
  prompt: `You are an AI assistant designed to suggest the most suitable project template based on the content provided by the user.

  Analyze the following content and suggest a template that would be most effective for organizing and managing the information.
  Explain your reasoning for choosing the suggested template.

  Content: {{{content}}}

  Template Suggestion (e.g., "Meeting Agenda", "Marketing Plan", "Project Timeline"): 
  Reasoning: `,
});

const suggestOptimalTemplateFlow = ai.defineFlow(
  {
    name: 'suggestOptimalTemplateFlow',
    inputSchema: SuggestOptimalTemplateInputSchema,
    outputSchema: SuggestOptimalTemplateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
