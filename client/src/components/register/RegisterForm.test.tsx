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
})
