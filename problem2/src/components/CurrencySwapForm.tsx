import { useState, useEffect, useCallback, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TokenSelector } from './TokenSelector'
import { AmountInput } from './AmountInput'
import type { Token } from '../types/token'
import { swapFormSchema, type SwapFormData } from '../schemas/swapFormSchema'
import {
  fetchTokenPrices,
  getTokenIconUrl,
  calculateExchangeRate,
  calculateToAmount,
  calculateFromAmount,
} from '../services/priceService'
import { formatAmount } from '../utils/validation'

interface CurrencySwapFormProps {
  onTokensLoaded?: (tokens: Token[]) => void
}

export function CurrencySwapForm({ onTokensLoaded }: CurrencySwapFormProps = {}) {
  const [tokens, setTokens] = useState<Token[]>([])
  const [prices, setPrices] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastEditedField, setLastEditedField] = useState<'from' | 'to' | null>(null)
  const [openSelector, setOpenSelector] = useState<'from' | 'to' | null>(null)

  // Initialize React Hook Form
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<SwapFormData>({
    resolver: zodResolver(swapFormSchema),
    defaultValues: {
      fromToken: '',
      toToken: '',
      fromAmount: '',
      toAmount: '',
    },
    mode: 'onChange', // Validate on change for better UX
  })

  // Watch form values
  const fromToken = watch('fromToken')
  const toToken = watch('toToken')
  const fromAmount = watch('fromAmount')
  const toAmount = watch('toAmount')

  // Calculate exchange rate
  const exchangeRate = calculateExchangeRate(
    prices[fromToken],
    prices[toToken]
  )

  // Check if form is valid for submission
  const isFormValid = (() => {
    if (!fromToken || !toToken || fromToken === toToken) return false
    if (!fromAmount || !toAmount) return false
    
    const fromAmountNum = parseFloat(fromAmount)
    const toAmountNum = parseFloat(toAmount)
    
    if (isNaN(fromAmountNum) || isNaN(toAmountNum)) return false
    if (fromAmountNum <= 0 || toAmountNum <= 0) return false
    if (!exchangeRate) return false
    
    return true
  })()

  // Fetch token prices on mount
  useEffect(() => {
    async function loadPrices() {
      try {
        setLoading(true)
        setError(null)
        const priceData = await fetchTokenPrices()
        setPrices(priceData)

        // Create token list from available prices
        const tokenList: Token[] = Object.keys(priceData).map((symbol) => ({
          symbol,
          name: symbol,
          iconUrl: getTokenIconUrl(symbol),
          price: priceData[symbol],
        }))

        setTokens(tokenList)

        // Notify parent component about loaded tokens and prices
        onTokensLoaded?.(tokenList)

        // Set default tokens if available
        if (tokenList.length >= 2) {
          setValue('fromToken', tokenList[0].symbol)
          setValue('toToken', tokenList[1].symbol)
        }
      } catch (err) {
        console.info('Error loading prices:', err)
        setError('Failed to load token prices. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadPrices()
  }, [setValue])

  // Update toAmount when fromAmount changes
  useEffect(() => {
    if (lastEditedField === 'from' && fromAmount) {
      const fromAmountNum = parseFloat(fromAmount)
      if (!isNaN(fromAmountNum) && fromAmountNum > 0 && exchangeRate) {
        const calculated = calculateToAmount(fromAmountNum, exchangeRate)
        setValue('toAmount', formatAmount(calculated), { shouldValidate: false })
        // Clear error of toAmount when it's auto-calculated from valid fromAmount
        clearErrors('toAmount')
      } else if (fromAmount === '') {
        setValue('toAmount', '', { shouldValidate: false })
        clearErrors('toAmount')
      }
    }
  }, [fromAmount, exchangeRate, lastEditedField, setValue, clearErrors])

  // Update fromAmount when toAmount changes
  useEffect(() => {
    if (lastEditedField === 'to' && toAmount) {
      const toAmountNum = parseFloat(toAmount)
      if (!isNaN(toAmountNum) && toAmountNum > 0 && exchangeRate) {
        const calculated = calculateFromAmount(toAmountNum, exchangeRate)
        setValue('fromAmount', formatAmount(calculated), { shouldValidate: false })
        // Clear error of fromAmount when it's auto-calculated from valid toAmount
        // Also trigger validation to ensure the new value is valid
        clearErrors('fromAmount')
        trigger('fromAmount')
      } else if (toAmount === '') {
        setValue('fromAmount', '', { shouldValidate: false })
        clearErrors('fromAmount')
      }
    }
  }, [toAmount, exchangeRate, lastEditedField, setValue, clearErrors, trigger])

  // Track previous tokens to detect changes
  const prevTokensRef = useRef({ from: '', to: '' })
  const isSwappingRef = useRef(false)

  // Reset amounts when tokens change (but not when swapping)
  useEffect(() => {
    // Skip if we're in the middle of a swap
    if (isSwappingRef.current) {
      isSwappingRef.current = false
      prevTokensRef.current = { from: fromToken, to: toToken }
      return
    }

    const fromChanged = prevTokensRef.current.from !== fromToken
    const toChanged = prevTokensRef.current.to !== toToken

    // Only reset if one token changed (not both - which would be a swap)
    if (fromChanged && !toChanged) {
      // Only fromToken changed
      setValue('fromAmount', '', { shouldValidate: false })
      setValue('toAmount', '', { shouldValidate: false })
      clearErrors('fromAmount')
      clearErrors('toAmount')
      setLastEditedField(null)
    } else if (toChanged && !fromChanged) {
      // Only toToken changed
      setValue('fromAmount', '', { shouldValidate: false })
      setValue('toAmount', '', { shouldValidate: false })
      clearErrors('fromAmount')
      clearErrors('toAmount')
      setLastEditedField(null)
    }

    prevTokensRef.current = { from: fromToken, to: toToken }
  }, [fromToken, toToken, setValue, clearErrors])

  const handleFromAmountChange = useCallback((value: string) => {
    setValue('fromAmount', value)
    setLastEditedField('from')
    // Clear error of toAmount if fromAmount is being updated and is valid
    const numValue = parseFloat(value)
    if (value && !isNaN(numValue) && numValue > 0) {
      clearErrors('toAmount')
    }
  }, [setValue, clearErrors])

  const handleToAmountChange = useCallback((value: string) => {
    setValue('toAmount', value)
    setLastEditedField('to')
    // Clear error of fromAmount if toAmount is being updated and is valid
    // This will trigger recalculation of fromAmount which should clear its error
    const numValue = parseFloat(value)
    if (value && !isNaN(numValue) && numValue > 0) {
      // Clear error immediately, validation will be triggered in useEffect
      clearErrors('fromAmount')
    }
  }, [setValue, clearErrors])

  const handleFromTokenChange = useCallback((token: string) => {
    if (token === toToken) {
      // Swap tokens if selecting the same token
      setValue('fromToken', toToken)
      setValue('toToken', fromToken)
    } else {
      setValue('fromToken', token)
      // Clear errors when token changes
      clearErrors('fromToken')
      clearErrors('fromAmount')
      clearErrors('toAmount')
    }
  }, [toToken, fromToken, setValue, clearErrors])

  const handleToTokenChange = useCallback((token: string) => {
    if (token === fromToken) {
      // Swap tokens if selecting the same token
      setValue('fromToken', toToken)
      setValue('toToken', fromToken)
    } else {
      setValue('toToken', token)
      // Clear errors when token changes
      clearErrors('toToken')
      clearErrors('fromAmount')
      clearErrors('toAmount')
    }
  }, [fromToken, toToken, setValue, clearErrors])

  const handleSwapTokens = useCallback(() => {
    // Mark that we're swapping to prevent reset
    isSwappingRef.current = true

    // Swap tokens and amounts
    setValue('fromToken', toToken)
    setValue('toToken', fromToken)
    setValue('fromAmount', toAmount)
    setValue('toAmount', fromAmount)

    // Swap lastEditedField as well
    setLastEditedField((prev) => {
      if (prev === 'from') return 'to'
      if (prev === 'to') return 'from'
      return prev
    })
  }, [fromToken, toToken, fromAmount, toAmount, setValue])

  const onSubmit = async (data: SwapFormData) => {
    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real app, this would call an API to execute the swap
    console.info('Swap submitted:', {
      from: {
        token: data.fromToken,
        amount: data.fromAmount,
      },
      to: {
        token: data.toToken,
        amount: data.toAmount,
      },
      exchangeRate,
    })

    // Show success message (in a real app, this would be a toast notification)
    alert(
      `Successfully swapped ${data.fromAmount} ${data.fromToken} for ${data.toAmount} ${data.toToken}`
    )
  }

  const fromTokenData = tokens.find((t) => t.symbol === fromToken)
  const toTokenData = tokens.find((t) => t.symbol === toToken)

  if (loading) {
    return (
      <div className="swap-form-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading token prices...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="swap-form-container">
        <div className="error-container">
          <p className="error-text">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="swap-form-container">
      <div className="swap-form-card">
        <h1 className="swap-form-title">Currency Swap</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="swap-form">
          <div className="swap-form-section">
            <Controller
              name="fromToken"
              control={control}
              render={({ field }) => (
                <TokenSelector
                  tokens={tokens}
                  selectedToken={field.value}
                  onTokenChange={(token) => {
                    field.onChange(token)
                    handleFromTokenChange(token)
                  }}
                  label="From"
                  error={errors.fromToken?.message}
                  disabledTokens={toToken ? [toToken] : []}
                  isOpen={openSelector === 'from'}
                  onOpenChange={(isOpen) => {
                    setOpenSelector(isOpen ? 'from' : null)
                  }}
                />
              )}
            />
            <Controller
              name="fromAmount"
              control={control}
              render={({ field }) => (
                <AmountInput
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value)
                    handleFromAmountChange(value)
                  }}
                  token={fromTokenData}
                  label="Amount"
                  error={errors.fromAmount?.message}
                />
              )}
            />
          </div>

          <div className="swap-form-divider">
            <button
              type="button"
              onClick={handleSwapTokens}
              className="swap-button"
              aria-label="Swap tokens"
            >
              ⇅
            </button>
          </div>

          <div className="swap-form-section">
            <Controller
              name="toToken"
              control={control}
              render={({ field }) => (
                <TokenSelector
                  tokens={tokens}
                  selectedToken={field.value}
                  onTokenChange={(token) => {
                    field.onChange(token)
                    handleToTokenChange(token)
                  }}
                  label="To"
                  error={errors.toToken?.message}
                  disabledTokens={fromToken ? [fromToken] : []}
                  isOpen={openSelector === 'to'}
                  onOpenChange={(isOpen) => {
                    setOpenSelector(isOpen ? 'to' : null)
                  }}
                />
              )}
            />
            <Controller
              name="toAmount"
              control={control}
              render={({ field }) => (
                <AmountInput
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value)
                    handleToAmountChange(value)
                  }}
                  token={toTokenData}
                  label="Amount"
                  error={errors.toAmount?.message}
                />
              )}
            />
          </div>

          {exchangeRate && (
            <div className="exchange-rate">
              <span>Exchange Rate:</span>
              <span>
                1 {fromToken} = {formatAmount(exchangeRate)} {toToken}
              </span>
            </div>
          )}

          {errors.toToken && errors.toToken.message === 'Cannot swap the same token' && (
            <div className="error-message-general">{errors.toToken.message}</div>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? (
              <>
                <span className="button-spinner"></span>
                Processing...
              </>
            ) : (
              'Swap'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}