import * as z from 'zod'

export const createMemoSchema = z.object({
  memo: z.string()
    .min(1, { message: '"memo" cannot be empty.' })
    .max(10000, { message: '"memo" cannot exceed 10,000 characters.' })
    .trim(),
});

export const getMemoByPasskeySchema = z.object({
  passkey: z.string()
    .length(6, { message: '"passkey" must be exactly 6 characters long.' })
    .regex(/^[a-z0-9]+$/, { message: '"passkey" must contain only lowercase letters and numbers.' }),
});

export const memoIdParamSchema = z.object({
  memoId: z.uuid({ message: '"memoId" must be a valid UUID.' }),
});
