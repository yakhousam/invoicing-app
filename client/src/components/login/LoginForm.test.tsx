import { API_URL } from '@/config'
import { HttpResponse, http, server } from '@/mocks/node'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import LoginForm from './LoginForm'

describe('LoginForm', () => {
  it('renders', () => {
    render(<LoginForm onLogin={() => {}} />)
    expect(
      screen.getByRole('heading', { name: /sign in/i })
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('login user', async () => {
    const mockOnLogin = vi.fn()
    render(<LoginForm onLogin={mockOnLogin} />)
    await userEvent.type(screen.getByLabelText(/username/i), 'test')
    await userEvent.type(screen.getByLabelText(/password/i), 'password')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalled()
    })
  })

  it('not login user with invalid credentials', async () => {
    server.use(
      http.post(API_URL.auth.login, () => {
        return new HttpResponse(null, { status: 401 })
      })
    )
    const mockOnLogin = vi.fn()
    render(<LoginForm onLogin={mockOnLogin} />)

    await userEvent.type(screen.getByLabelText(/username/i), 'test')
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(mockOnLogin).not.toHaveBeenCalled()
    })
    expect(screen.getByRole('alert')).toBeInTheDocument() // error message
    expect(screen.getByRole('alert')).toHaveTextContent(
      /username or password invalide/i
    )
  })
})
