import * as z from 'zod'

export const createMemoSchema = z.object({
  memo: z.string().min(1, { message: '"memo" cannot be empty.' }),
});

export const getMemoByPasskeySchema = z.object({
  passkey: z.string().length(6, { message: '"passkey" must be 6 characters long.' }),
});

export const memoIdParamSchema = z.object({
  memoId: z.uuid(),
});
