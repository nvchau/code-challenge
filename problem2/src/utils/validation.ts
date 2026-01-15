export function validateAmount(amount: string): string | undefined {
  if (!amount || amount.trim() === '') {
    return 'Amount is required'
  }
  
  // Check if the string is a valid number format (allows digits, optional minus sign, and single decimal point)
  const trimmed = amount.trim()
  if (!/^-?\d*\.?\d+$/.test(trimmed)) {
    return 'Please enter a valid number'
  }
  
  const numAmount = parseFloat(trimmed)
  
  if (isNaN(numAmount)) {
    return 'Please enter a valid number'
  }
  
  if (numAmount <= 0) {
    return 'Amount must be greater than 0'
  }
  
  if (numAmount > Number.MAX_SAFE_INTEGER) {
    return 'Amount is too large'
  }
  
  return undefined
}

export function formatAmount(amount: number | null): string {
  if (amount === null || isNaN(amount)) {
    return ''
  }
  
  // Format to maximum 8 decimal places, removing trailing zeros
  // Use Math.floor to avoid rounding issues
  const multiplier = Math.pow(10, 8)
  const rounded = Math.floor(amount * multiplier) / multiplier
  return rounded.toFixed(8).replace(/\.?0+$/, '')
}