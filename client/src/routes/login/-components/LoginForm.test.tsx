import { baseUrl } from '@/config'
import { HttpResponse, http, server } from '@/mocks/node'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import LoginForm from './LoginForm'

describe('LoginForm', () => {
  it('renders', () => {
    const { getByLabelText, getByRole } = render(
      <LoginForm onLogin={() => {}} />
    )
    expect(getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
    expect(getByLabelText(/username/i)).toBeInTheDocument()
    expect(getByLabelText(/password/i)).toBeInTheDocument()
    expect(getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('login user', async () => {
    const mockOnLogin = vi.fn()
    const { getByLabelText, getByRole } = render(
      <LoginForm onLogin={mockOnLogin} />
    )
    await userEvent.type(getByLabelText(/username/i), 'test')
    await userEvent.type(getByLabelText(/password/i), 'password')
    await userEvent.click(getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalled()
    })
  })

  it('not login user with invalid credentials', async () => {
    server.use(
      http.post(`${baseUrl}/auth/signin`, () => {
        return new HttpResponse(null, { status: 401 })
      })
    )
    const mockOnLogin = vi.fn()
    const { getByLabelText, getByRole } = render(
      <LoginForm onLogin={mockOnLogin} />
    )

    await userEvent.type(getByLabelText(/username/i), 'test')
    await userEvent.type(getByLabelText(/password/i), 'wrongpassword')
    await userEvent.click(getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockOnLogin).not.toHaveBeenCalled()
    })
    expect(getByRole('alert')).toBeInTheDocument() // error message
  })
})
