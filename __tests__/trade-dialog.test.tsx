/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

const mockApi = vi.fn()
vi.mock('@/lib/api', () => ({ api: (...args: any[]) => mockApi(...args) }))

import { TradeDialog } from '@/components/trade-dialog'

describe('TradeDialog', () => {
  beforeEach(() => mockApi.mockReset())

  test('submitting invalid quantity/price shows validation and does not call API', async () => {
    const asset = { ticker: 'ABC', current_price: 10 } as any
    render(<TradeDialog asset={asset} kind="buy" />)
    // Open dialog
    fireEvent.click(screen.getByRole('button', { name: /Comprar/i }))
    // Fill invalid values
    const quantity = screen.getByLabelText(/Quantidade/i)
    const price = screen.getByLabelText(/Preço unitário/i)
    fireEvent.change(quantity, { target: { value: '-1' } })
    fireEvent.change(price, { target: { value: '0' } })
    fireEvent.click(screen.getByRole('button', { name: /Confirmar operação/i }))
    // Ensure the API was not called for invalid input
    await waitFor(() => expect(mockApi).not.toHaveBeenCalled())
  })
})
