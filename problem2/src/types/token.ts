export interface TokenPrice {
  currency: string
  price: number
}

export interface Token {
  symbol: string
  name: string
  iconUrl: string
  price?: number
}

// Legacy interface - kept for backward compatibility
// New code should use SwapFormData from schemas/swapFormSchema.ts
export interface SwapFormData {
  fromToken: string
  toToken: string
  fromAmount: string
  toAmount: string
}

export interface SwapFormErrors {
  fromAmount?: string
  toAmount?: string
  fromToken?: string
  toToken?: string
  general?: string
}