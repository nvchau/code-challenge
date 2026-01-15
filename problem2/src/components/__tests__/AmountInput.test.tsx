import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AmountInput } from '../AmountInput'
import type { Token } from '../../types/token'

const mockToken: Token = {
  symbol: 'SWTH',
  name: 'Switcheo',
  iconUrl: 'https://example.com/swth.svg',
  price: 0.1,
}

describe('AmountInput', () => {
  it('renders with label and value', () => {
    const onChange = vi.fn()
    render(
      <AmountInput
        value="100"
        onChange={onChange}
        token={mockToken}
        label="Amount"
      />
    )

    expect(screen.getByText('Amount')).toBeInTheDocument()
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('100')
  })

  it('calls onChange when value changes', () => {
    const onChange = vi.fn()
    render(
      <AmountInput
        value=""
        onChange={onChange}
        token={mockToken}
        label="Amount"
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '50' } })

    expect(onChange).toHaveBeenCalledWith('50')
  })

  it('only allows numeric input with decimal point', () => {
    const onChange = vi.fn()
    render(
      <AmountInput
        value=""
        onChange={onChange}
        token={mockToken}
        label="Amount"
      />
    )

    const input = screen.getByRole('textbox')
    
    // Valid input
    fireEvent.change(input, { target: { value: '123.45' } })
    expect(onChange).toHaveBeenCalledWith('123.45')

    // Invalid input (letters)
    fireEvent.change(input, { target: { value: 'abc' } })
    expect(onChange).not.toHaveBeenCalledWith('abc')

    // Invalid input (special characters)
    fireEvent.change(input, { target: { value: '12@34' } })
    expect(onChange).not.toHaveBeenCalledWith('12@34')
  })

  it('displays token symbol and price', () => {
    const onChange = vi.fn()
    render(
      <AmountInput
        value="100"
        onChange={onChange}
        token={mockToken}
        label="Amount"
      />
    )

    expect(screen.getByText('SWTH')).toBeInTheDocument()
    expect(screen.getByText('$0.10')).toBeInTheDocument()
  })

  it('displays error message when error prop is provided', () => {
    const onChange = vi.fn()
    render(
      <AmountInput
        value=""
        onChange={onChange}
        token={mockToken}
        label="Amount"
        error="Amount is required"
      />
    )

    expect(screen.getByText('Amount is required')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    const onChange = vi.fn()
    render(
      <AmountInput
        value="100"
        onChange={onChange}
        token={mockToken}
        label="Amount"
        disabled={true}
      />
    )

    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('renders without token', () => {
    const onChange = vi.fn()
    render(
      <AmountInput
        value="100"
        onChange={onChange}
        token={undefined}
        label="Amount"
      />
    )

    expect(screen.queryByText('SWTH')).not.toBeInTheDocument()
  })
})