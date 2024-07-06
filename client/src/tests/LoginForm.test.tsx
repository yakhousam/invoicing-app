import { API_URL } from '@/config'

import { HttpResponse, http, server } from '@/tests/utils/node'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import LoginForm from '../components/login/LoginForm'
import { renderWithRouterContext } from './utils/wrappers'

describe('LoginForm', () => {
  it('renders', async () => {
    const mockOnLogin = vi.fn()
    renderWithRouterContext({
      component: <LoginForm onLogin={mockOnLogin} />,
      path: '/login'
    })

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /sign in/i })
      ).toBeInTheDocument()
    )

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('login user', async () => {
    const user = userEvent.setup()
    const mockOnLogin = vi.fn()
    renderWithRouterContext({
      component: <LoginForm onLogin={mockOnLogin} />,
      path: '/login',
      initialEntries: ['/', '/login']
    })
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /sign in/i })
      ).toBeInTheDocument()
    )
    await user.type(screen.getByLabelText(/username/i), 'test')
    await user.type(screen.getByLabelText(/password/i), 'password')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
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
    renderWithRouterContext({
      component: <LoginForm onLogin={mockOnLogin} />,
      path: '/login'
    })
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /sign in/i })
      ).toBeInTheDocument()
    )

    await userEvent.type(screen.getByLabelText(/username/i), 'test')
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(mockOnLogin).not.toHaveBeenCalled()
    })
    expect(screen.getByRole('alert')).toBeInTheDocument() // error message
    expect(screen.getByRole('alert')).toHaveTextContent(
      /username or password invalid/i
    )
  })
})
