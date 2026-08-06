import { z } from 'zod';

export const transactionSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title is too long'),
  amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Enter a valid amount greater than ₹0',
    }),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
  categoryId: z.string().min(1, 'Please select a category'),
  accountId: z.string().min(1, 'Please select an account'),
  notes: z.string().optional(),
});

export type TransactionSchemaType = z.infer<typeof transactionSchema>;
