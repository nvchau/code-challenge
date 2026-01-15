import { useState, useEffect } from 'react'
import type { Token } from '../types/token'

interface TokenSelectorProps {
  tokens: Token[]
  selectedToken: string
  onTokenChange: (token: string) => void
  label: string
  disabled?: boolean
  error?: string
  disabledTokens?: string[] // Tokens that should be disabled in dropdown
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

export function TokenSelector({
  tokens,
  selectedToken,
  onTokenChange,
  label,
  disabled = false,
  error,
  disabledTokens = [],
  isOpen: controlledIsOpen,
  onOpenChange,
}: TokenSelectorProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const setIsOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value)
    } else {
      setInternalIsOpen(value)
    }
  }
  const [iconError, setIconError] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const selectedTokenData = tokens.find((t) => t.symbol === selectedToken)

  // Filter tokens based on search query (but keep disabled tokens visible)
  const filteredTokens = tokens.filter((token) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      token.symbol.toLowerCase().includes(query) ||
      (token.name && token.name.toLowerCase().includes(query))
    )
  })

  // Reset icon error when token changes
  useEffect(() => {
    setIconError(false)
  }, [selectedToken])

  // Reset search when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.token-selector')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, setIsOpen])

  return (
    <div className="token-selector">
      <label className="token-selector-label">{label}</label>
      <div className="token-selector-wrapper">
        <button
          type="button"
          className={`token-selector-button ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          {selectedTokenData ? (
            <>
              {!iconError ? (
                <img
                  src={selectedTokenData.iconUrl}
                  alt={selectedTokenData.symbol}
                  className="token-icon"
                  onError={() => setIconError(true)}
                />
              ) : (
                <div className="token-icon-fallback">
                  {selectedTokenData.symbol.charAt(0)}
                </div>
              )}
              <span className="token-symbol">{selectedTokenData.symbol}</span>
            </>
          ) : (
            <span className="token-placeholder">Select token</span>
          )}
          <span className="token-selector-arrow">▼</span>
        </button>
        {isOpen && (
          <div className="token-dropdown">
            <div className="token-search-wrapper">
              <input
                type="text"
                className="token-search-input"
                placeholder="Search token..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
            <div className="token-dropdown-list">
              {filteredTokens.length > 0 ? (
                filteredTokens.map((token) => {
                  const isDisabled = disabledTokens.includes(token.symbol)
                  return (
                    <TokenOption
                      key={token.symbol}
                      token={token}
                      isSelected={selectedToken === token.symbol}
                      isDisabled={isDisabled}
                      onSelect={() => {
                        if (!isDisabled) {
                          onTokenChange(token.symbol)
                          setIsOpen(false)
                        }
                      }}
                    />
                  )
                })
              ) : (
                <div className="token-dropdown-empty">
                  No tokens found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}

// Separate component for token option to handle icon error state
function TokenOption({
  token,
  isSelected,
  isDisabled = false,
  onSelect,
}: {
  token: Token
  isSelected: boolean
  isDisabled?: boolean
  onSelect: () => void
}) {
  const [iconError, setIconError] = useState(false)

  return (
    <button
      type="button"
      className={`token-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
      onClick={onSelect}
      disabled={isDisabled}
    >
      {!iconError ? (
        <img
          src={token.iconUrl}
          alt={token.symbol}
          className="token-icon"
          onError={() => setIconError(true)}
        />
      ) : (
        <div className="token-icon-fallback">
          {token.symbol.charAt(0)}
        </div>
      )}
      <span className="token-option-name">{token.name || token.symbol}</span>
    </button>
  )
}