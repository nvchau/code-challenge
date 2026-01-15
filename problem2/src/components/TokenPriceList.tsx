import { useState, useEffect } from 'react'
import type { Token } from '../types/token'

interface TokenPriceListProps {
  tokens: Token[]
}

interface TokenPriceData {
  symbol: string
  price: number
  change24h: number
  iconUrl: string
}

export function TokenPriceList({ tokens }: TokenPriceListProps) {
  const [priceData, setPriceData] = useState<TokenPriceData[]>([])
  const [iconErrors, setIconErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Simulate 24h price changes (in real app, this would come from API)
    const data: TokenPriceData[] = tokens
      .filter((token) => token.price !== undefined)
      .map((token) => {
        // Simulate random price change between -5% and +5%
        const change24h = (Math.random() * 10 - 5).toFixed(2)
        return {
          symbol: token.symbol,
          price: token.price!,
          change24h: parseFloat(change24h),
          iconUrl: token.iconUrl,
        }
      })
      .sort((a, b) => b.price - a.price) // Sort by price descending
      .slice(0, 7) // Show top 7 tokens

    setPriceData(data)
  }, [tokens])

  const handleIconError = (symbol: string) => {
    setIconErrors((prev) => ({ ...prev, [symbol]: true }))
  }

  if (priceData.length === 0) {
    return null
  }

  return (
    <div className="token-price-list">
      <div className="token-price-list-header">
        <h2 className="token-price-list-title">Market Prices</h2>
        <span className="token-price-list-subtitle">24h Change</span>
      </div>
      <div className="token-price-list-content">
        {priceData.map((token) => {
          const isPositive = token.change24h >= 0
          const hasIconError = iconErrors[token.symbol]

          return (
            <div key={token.symbol} className="token-price-item">
              <div className="token-price-item-left">
                {!hasIconError ? (
                  <img
                    src={token.iconUrl}
                    alt={token.symbol}
                    className="token-price-icon"
                    onError={() => handleIconError(token.symbol)}
                  />
                ) : (
                  <div className="token-price-icon-fallback">
                    {token.symbol.charAt(0)}
                  </div>
                )}
                <div className="token-price-info">
                  <span className="token-price-symbol">{token.symbol}</span>
                  <span className="token-price-value">
                    ${token.price.toFixed(2)}
                  </span>
                </div>
              </div>
              <div
                className={`token-price-change ${isPositive ? 'positive' : 'negative'}`}
              >
                {isPositive ? '↑' : '↓'} {Math.abs(token.change24h).toFixed(2)}%
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}