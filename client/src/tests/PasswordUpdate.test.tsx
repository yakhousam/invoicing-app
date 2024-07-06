import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PasswordUpdate from '../components/settings/PasswordUpdate'
import { renderWithRouterContext } from './utils/wrappers'

describe('PasswordUpdate', () => {
  it('renders', async () => {
    renderWithRouterContext({
      component: <PasswordUpdate />
    })

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /password/i })
      ).toBeInTheDocument()
    })

    expect(screen.getByText(/update your password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/old password/i)).toBeInTheDocument()
    expect(screen.getByLabelText('New password')).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })
})
