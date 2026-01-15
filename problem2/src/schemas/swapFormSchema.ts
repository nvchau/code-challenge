import { z } from 'zod'

// Custom validation for amount
const amountSchema = z.string()
  .min(1, 'Amount is required')
  .refine(
    (val) => {
      const trimmed = val.trim()
      return /^-?\d*\.?\d+$/.test(trimmed)
    },
    'Please enter a valid number'
  )
  .refine(
    (val) => {
      const num = parseFloat(val.trim())
      return !isNaN(num) && num > 0
    },
    'Amount must be greater than 0'
  )
  .refine(
    (val) => {
      const num = parseFloat(val.trim())
      return num <= Number.MAX_SAFE_INTEGER
    },
    'Amount is too large'
  )

export const swapFormSchema = z.object({
  fromToken: z.string().min(1, 'Please select a token to swap from'),
  toToken: z.string().min(1, 'Please select a token to swap to'),
  fromAmount: amountSchema,
  toAmount: amountSchema,
}).superRefine((data, ctx) => {
  // Custom validation for same token
  if (data.fromToken === data.toToken && data.fromToken !== '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Cannot swap the same token',
      path: ['toToken'],
    })
  }
})

export type SwapFormData = z.infer<typeof swapFormSchema>