import { describe, it, expect } from 'vitest'
import { validateAmount, formatAmount } from '../validation'

describe('validateAmount', () => {
  it('returns undefined for valid positive number', () => {
    expect(validateAmount('100')).toBeUndefined()
    expect(validateAmount('100.50')).toBeUndefined()
    expect(validateAmount('0.001')).toBeUndefined()
  })

  it('returns error for empty string', () => {
    expect(validateAmount('')).toBe('Amount is required')
    expect(validateAmount('   ')).toBe('Amount is required')
  })

  it('returns error for invalid number', () => {
    expect(validateAmount('abc')).toBe('Please enter a valid number')
    expect(validateAmount('12.34.56')).toBe('Please enter a valid number')
  })

  it('returns error for zero or negative number', () => {
    expect(validateAmount('0')).toBe('Amount must be greater than 0')
    expect(validateAmount('-10')).toBe('Amount must be greater than 0')
  })

  it('returns error for very large number', () => {
    const largeNumber = (Number.MAX_SAFE_INTEGER + 1).toString()
    expect(validateAmount(largeNumber)).toBe('Amount is too large')
  })
})

describe('formatAmount', () => {
  it('formats number with up to 8 decimal places', () => {
    expect(formatAmount(100)).toBe('100')
    expect(formatAmount(100.5)).toBe('100.5')
    // Note: Due to floating point precision, we test with a value that won't round
    expect(formatAmount(100.12345678)).toBe('100.12345678')
  })

  it('removes trailing zeros', () => {
    expect(formatAmount(100.0)).toBe('100')
    expect(formatAmount(100.5000)).toBe('100.5')
    expect(formatAmount(100.12300000)).toBe('100.123')
  })

  it('returns empty string for null', () => {
    expect(formatAmount(null)).toBe('')
  })

  it('handles NaN', () => {
    expect(formatAmount(NaN)).toBe('')
  })
})