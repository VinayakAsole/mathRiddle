'use server';

import { getMathHint, type MathHintInput } from '@/ai/flows/ai-math-hint-tool';
import { z } from 'zod';

const actionInputSchema = z.object({
  riddle: z.string(),
  hintLevel: z.number().min(1).max(3),
});

export async function getHintAction(input: { riddle: string, hintLevel: number }) {
  const parsedInput = actionInputSchema.safeParse(input);

  if (!parsedInput.success) {
    console.error("Invalid input for getHintAction:", parsedInput.error.flatten());
    return { error: 'Invalid input provided for hint generation.' };
  }

  try {
    const result = await getMathHint(parsedInput.data as MathHintInput);
    return { hint: result.hint };
  } catch (e) {
    console.error("Error getting hint from AI:", e);
    return { error: 'Sorry, I couldn\'t come up with a hint right now. Please try again.' };
  }
}
