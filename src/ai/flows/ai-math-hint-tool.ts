// src/ai/flows/ai-math-hint-tool.ts
'use server';

/**
 * @fileOverview Provides progressively more specific hints for a given math riddle using AI.
 *
 * - getMathHint - A function that returns a math hint based on the riddle and hint level.
 * - MathHintInput - The input type for the getMathHint function.
 * - MathHintOutput - The return type for the getMathHint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MathHintInputSchema = z.object({
  riddle: z.string().describe('The math riddle to provide a hint for.'),
  hintLevel: z
    .number()
    .min(1)
    .max(3)
    .describe(
      'The level of hint requested. 1 is a general tip, 2 is more specific, and 3 is the most specific.'
    ),
});
export type MathHintInput = z.infer<typeof MathHintInputSchema>;

const MathHintOutputSchema = z.object({
  hint: z.string().describe('The AI-generated hint for the math riddle.'),
});
export type MathHintOutput = z.infer<typeof MathHintOutputSchema>;

export async function getMathHint(input: MathHintInput): Promise<MathHintOutput> {
  return getMathHintFlow(input);
}

const hintPrompt = ai.definePrompt({
  name: 'hintPrompt',
  input: {schema: MathHintInputSchema},
  output: {schema: MathHintOutputSchema},
  prompt: `You are a helpful math tutor. Provide a hint for the following math riddle.

Riddle: {{{riddle}}}

Hint Level: {{{hintLevel}}}

Respond with a hint that is appropriate for the given hint level. If the hint level is 1, provide a general tip. If the hint level is 2, provide a more specific hint. If the hint level is 3, provide the most specific hint possible without giving away the answer.
`,
});

const getMathHintFlow = ai.defineFlow(
  {
    name: 'getMathHintFlow',
    inputSchema: MathHintInputSchema,
    outputSchema: MathHintOutputSchema,
  },
  async input => {
    const {output} = await hintPrompt(input);
    return output!;
  }
);
