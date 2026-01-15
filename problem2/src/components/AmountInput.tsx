import type { Token } from '../types/token'

interface AmountInputProps {
  value: string
  onChange: (value: string) => void
  token: Token | undefined
  label: string
  disabled?: boolean
  error?: string
  placeholder?: string
}

export function AmountInput({
  value,
  onChange,
  token,
  label,
  disabled = false,
  error,
  placeholder = '0.00',
}: AmountInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    
    // Allow empty string, numbers, and single decimal point
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      onChange(inputValue)
    }
  }

  return (
    <div className="amount-input">
      <label className="amount-input-label">{label}</label>
      <div className="amount-input-wrapper">
        <input
          type="text"
          className={`amount-input-field ${error ? 'error' : ''}`}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          inputMode="decimal"
        />
        {token && (
          <div className="amount-input-token">
            <span className="amount-input-token-symbol">{token.symbol}</span>
            {token.price && (
              <span className="amount-input-token-price">
                ${token.price.toFixed(2)}
              </span>
            )}
          </div>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}