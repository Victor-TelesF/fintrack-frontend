/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

const mockSignIn = vi.fn()
vi.mock('@/components/auth-provider', () => ({ useAuth: () => ({ signIn: mockSignIn }) }))
const mockApi = vi.fn()
vi.mock('@/lib/api', () => ({ api: (...args: any[]) => mockApi(...args) }))

import LoginPage from '@/app/login/page'

describe('Login flow', () => {
  beforeEach(() => {
    mockSignIn.mockReset()
    mockApi.mockReset()
  })

  test('successful login redirects to dashboard via signIn', async () => {
    mockApi.mockResolvedValueOnce({ access_token: 'tok' })
    render(<LoginPage />)
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: 'user' } })
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'pass' } })
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }))
    await waitFor(() => expect(mockSignIn).toHaveBeenCalledWith('tok', 'user'))
  })

  test('invalid credentials show backend message', async () => {
    mockApi.mockRejectedValueOnce(new Error('Usuário ou senha incorretos'))
    render(<LoginPage />)
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: 'bad' } })
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'bad' } })
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }))
    await waitFor(() => expect(screen.getByText(/Usuário ou senha incorretos/i)).toBeInTheDocument())
  })
})
