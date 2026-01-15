import type { TokenPrice } from '../types/token'

const PRICES_API_URL = 'https://interview.switcheo.com/prices.json'

export async function fetchTokenPrices(): Promise<Record<string, number>> {
  try {
    const response = await fetch(PRICES_API_URL)
    if (!response.ok) {
      throw new Error(`Failed to fetch prices: ${response.statusText}`)
    }
    const data: TokenPrice[] = await response.json()
    
    // Convert array to object for easier lookup
    const priceMap: Record<string, number> = {}
    data.forEach((item) => {
      priceMap[item.currency] = item.price
    })
    
    return priceMap
  } catch (error) {
    console.info('Error fetching token prices:', error)
    throw error
  }
}

export function getTokenIconUrl(symbol: string): string {
  // Keep original case to match GitHub repository naming
  return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${symbol}.svg`
}

export function calculateExchangeRate(
  fromPrice: number | undefined,
  toPrice: number | undefined
): number | null {
  if (!fromPrice || !toPrice) {
    return null
  }
  return fromPrice / toPrice
}

export function calculateToAmount(
  fromAmount: number,
  exchangeRate: number | null
): number | null {
  if (!exchangeRate) {
    return null
  }
  return fromAmount * exchangeRate
}

export function calculateFromAmount(
  toAmount: number,
  exchangeRate: number | null
): number | null {
  if (!exchangeRate) {
    return null
  }
  return toAmount / exchangeRate
}