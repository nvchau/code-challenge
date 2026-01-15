import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  fetchTokenPrices,
  getTokenIconUrl,
  calculateExchangeRate,
  calculateToAmount,
  calculateFromAmount,
} from '../priceService'

describe('priceService', () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  describe('fetchTokenPrices', () => {
    it('fetches and converts prices to object', async () => {
      const mockPrices = [
        { currency: 'SWTH', price: 0.1 },
        { currency: 'ETH', price: 2000 },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPrices,
      })

      const result = await fetchTokenPrices()

      expect(result).toEqual({
        SWTH: 0.1,
        ETH: 2000,
      })
    })

    it('throws error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      })

      await expect(fetchTokenPrices()).rejects.toThrow('Failed to fetch prices')
    })

    it('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(fetchTokenPrices()).rejects.toThrow()
    })
  })

  describe('getTokenIconUrl', () => {
    it('returns correct icon URL for token symbol', () => {
      expect(getTokenIconUrl('SWTH')).toBe(
        'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/SWTH.svg'
      )
      expect(getTokenIconUrl('bNEO')).toBe(
        'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/bNEO.svg'
      )
      expect(getTokenIconUrl('eth')).toBe(
        'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/eth.svg'
      )
    })
  })

  describe('calculateExchangeRate', () => {
    it('calculates exchange rate correctly', () => {
      expect(calculateExchangeRate(2000, 0.1)).toBe(20000)
      expect(calculateExchangeRate(0.1, 2000)).toBe(0.00005)
    })

    it('returns null when fromPrice is undefined', () => {
      expect(calculateExchangeRate(undefined, 2000)).toBeNull()
    })

    it('returns null when toPrice is undefined', () => {
      expect(calculateExchangeRate(2000, undefined)).toBeNull()
    })

    it('returns null when both prices are undefined', () => {
      expect(calculateExchangeRate(undefined, undefined)).toBeNull()
    })
  })

  describe('calculateToAmount', () => {
    it('calculates to amount correctly', () => {
      expect(calculateToAmount(100, 2)).toBe(200)
      expect(calculateToAmount(50, 0.5)).toBe(25)
    })

    it('returns null when exchange rate is null', () => {
      expect(calculateToAmount(100, null)).toBeNull()
    })
  })

  describe('calculateFromAmount', () => {
    it('calculates from amount correctly', () => {
      expect(calculateFromAmount(200, 2)).toBe(100)
      expect(calculateFromAmount(25, 0.5)).toBe(50)
    })

    it('returns null when exchange rate is null', () => {
      expect(calculateFromAmount(200, null)).toBeNull()
    })
  })
})