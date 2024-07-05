import { API_URL } from '@/config'
import { HttpResponse, http, server } from '@/mocks/node'
import { renderWithContext } from '@/mocks/utils'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import RegisterForm from './RegisterForm'

describe('RegisterForm', () => {
  it('renders', async () => {
    const mockOnRegister = vi.fn()
    renderWithContext({
      component: <RegisterForm onRegister={mockOnRegister} />,
      path: '/register'
    })

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /register/i })
      ).toBeInTheDocument()
    )

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /register/i })
    ).toBeInTheDocument()
  })
  it('register user', async () => {
    const user = userEvent.setup()
    const mockOnRegister = vi.fn()
    renderWithContext({
      component: <RegisterForm onRegister={mockOnRegister} />,
      path: '/register',
      initialEntries: ['/', '/register']
    })
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /register/i })
      ).toBeInTheDocument()
    )
    await user.type(screen.getByLabelText(/username/i), 'test')
    await user.type(screen.getByLabelText('Password'), 'password')
    await user.type(screen.getByLabelText(/confirm password/i), 'password')
    await user.click(screen.getByRole('button', { name: /register/i }))
    await waitFor(() => {
      expect(mockOnRegister).toHaveBeenCalled()
    })
  })

  it('not register user with duplicate username', async () => {
    const user = userEvent.setup()
    server.use(
      http.post(API_URL.auth.register, () => {
        return new HttpResponse(null, { status: 400 })
      })
    )
    const mockOnRegister = vi.fn()
    renderWithContext({
      component: <RegisterForm onRegister={mockOnRegister} />,
      path: '/register'
    })
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /register/i })
      ).toBeInTheDocument()
    )

    await user.type(screen.getByLabelText(/username/i), 'test')
    await user.type(screen.getByLabelText('Password'), 'password')
    await user.type(screen.getByLabelText(/confirm password/i), 'password')
    await user.click(screen.getByRole('button', { name: /register/i }))
    await waitFor(() => {
      expect(mockOnRegister).not.toHaveBeenCalled()
    })

    expect(screen.getByText(/username already exists/i)).toBeInTheDocument()
  })

  it('not register user with mismatched passwords', async () => {
    const user = userEvent.setup()
    const mockOnRegister = vi.fn()
    renderWithContext({
      component: <RegisterForm onRegister={mockOnRegister} />,
      path: '/register'
    })
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /register/i })
      ).toBeInTheDocument()
    )

    await user.type(screen.getByLabelText(/username/i), 'test')
    await user.type(screen.getByLabelText('Password'), 'password')
    await user.type(screen.getByLabelText(/confirm password/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /register/i }))
    await waitFor(() => {
      expect(mockOnRegister).not.toHaveBeenCalled()
    })

    expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument()
  })

  it('not register user with invalid password', async () => {
    const user = userEvent.setup()
    const mockOnRegister = vi.fn()
    renderWithContext({
      component: <RegisterForm onRegister={mockOnRegister} />,
      path: '/register'
    })
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /register/i })
      ).toBeInTheDocument()
    )

    await user.type(screen.getByLabelText(/username/i), 'test')
    await user.type(screen.getByLabelText('Password'), 'short')
    await user.type(screen.getByLabelText(/confirm password/i), 'short')
    await user.click(screen.getByRole('button', { name: /register/i }))
    await waitFor(() => {
      expect(mockOnRegister).not.toHaveBeenCalled()
    })

    expect(
      screen.getByText(/password must be at least 6 characters/i)
    ).toBeInTheDocument()
  })

  it('not register user with invalid username', async () => {
    const user = userEvent.setup()
    const mockOnRegister = vi.fn()
    renderWithContext({
      component: <RegisterForm onRegister={mockOnRegister} />,
      path: '/register'
    })
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /register/i })
      ).toBeInTheDocument()
    )

    await user.type(screen.getByLabelText(/username/i), 'a')
    await user.type(screen.getByLabelText('Password'), 'password')
    await user.type(screen.getByLabelText(/confirm password/i), 'password')
    await user.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(mockOnRegister).not.toHaveBeenCalled()
    })

    expect(
      screen.getByText(/username must be at least 2 characters/i)
    ).toBeInTheDocument()

    await user.clear(screen.getByLabelText(/username/i))
    await user.type(
      screen.getByLabelText(/username/i),
      'thisisaverylongusername'
    )
    await user.click(screen.getByRole('button', { name: /register/i }))
    await waitFor(() => {
      expect(mockOnRegister).not.toHaveBeenCalled()
    })

    expect(
      screen.getByText(/username must be at most 20 characters/i)
    ).toBeInTheDocument()
  })

  it('shows error message on server error', async () => {
    const user = userEvent.setup()
    server.use(
      http.post(API_URL.auth.register, () => {
        return new HttpResponse(null, { status: 500 })
      })
    )
    const mockOnRegister = vi.fn()
    renderWithContext({
      component: <RegisterForm onRegister={mockOnRegister} />,
      path: '/register'
    })
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /register/i })
      ).toBeInTheDocument()
    )

    await user.type(screen.getByLabelText(/username/i), 'test')
    await user.type(screen.getByLabelText('Password'), 'password')
    await user.type(screen.getByLabelText(/confirm password/i), 'password')
    await user.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(mockOnRegister).not.toHaveBeenCalled()
    })

    expect(screen.getByText(/error creating user/i)).toBeInTheDocument()
  })
})
