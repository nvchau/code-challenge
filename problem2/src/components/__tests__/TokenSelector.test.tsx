import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TokenSelector } from '../TokenSelector'
import type { Token } from '../../types/token'

const mockTokens: Token[] = [
  {
    symbol: 'SWTH',
    name: 'Switcheo',
    iconUrl: 'https://example.com/swth.svg',
    price: 0.1,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    iconUrl: 'https://example.com/eth.svg',
    price: 2000,
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    iconUrl: 'https://example.com/btc.svg',
    price: 50000,
  },
]

describe('TokenSelector', () => {
  it('renders with selected token', () => {
    const onTokenChange = vi.fn()
    render(
      <TokenSelector
        tokens={mockTokens}
        selectedToken="SWTH"
        onTokenChange={onTokenChange}
        label="From"
      />
    )

    expect(screen.getByText('From')).toBeInTheDocument()
    expect(screen.getByText('SWTH')).toBeInTheDocument()
  })

  it('shows placeholder when no token is selected', () => {
    const onTokenChange = vi.fn()
    render(
      <TokenSelector
        tokens={mockTokens}
        selectedToken=""
        onTokenChange={onTokenChange}
        label="To"
      />
    )

    expect(screen.getByText('Select token')).toBeInTheDocument()
  })

  it('opens dropdown when clicked', () => {
    const onTokenChange = vi.fn()
    render(
      <TokenSelector
        tokens={mockTokens}
        selectedToken="SWTH"
        onTokenChange={onTokenChange}
        label="From"
      />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(screen.getByText('ETH')).toBeInTheDocument()
    expect(screen.getByText('BTC')).toBeInTheDocument()
  })

  it('calls onTokenChange when token is selected', () => {
    const onTokenChange = vi.fn()
    render(
      <TokenSelector
        tokens={mockTokens}
        selectedToken="SWTH"
        onTokenChange={onTokenChange}
        label="From"
      />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const ethOption = screen.getByText('ETH').closest('button')
    if (ethOption) {
      fireEvent.click(ethOption)
    }

    expect(onTokenChange).toHaveBeenCalledWith('ETH')
  })

  it('displays error message when error prop is provided', () => {
    const onTokenChange = vi.fn()
    render(
      <TokenSelector
        tokens={mockTokens}
        selectedToken="SWTH"
        onTokenChange={onTokenChange}
        label="From"
        error="Please select a token"
      />
    )

    expect(screen.getByText('Please select a token')).toBeInTheDocument()
  })

  it('does not open dropdown when disabled', () => {
    const onTokenChange = vi.fn()
    render(
      <TokenSelector
        tokens={mockTokens}
        selectedToken="SWTH"
        onTokenChange={onTokenChange}
        label="From"
        disabled={true}
      />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(screen.queryByText('ETH')).not.toBeInTheDocument()
  })
})