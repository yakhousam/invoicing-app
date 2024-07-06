import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import UserInfos from '../components/settings/UserInfos'
import { renderWithRouterContext } from './utils/wrappers'

describe('UserInfo', () => {
  it('renders', async () => {
    renderWithRouterContext({
      component: <UserInfos />
    })

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /user information/i })
      ).toBeInTheDocument()
    })

    expect(
      screen.getByText(/update your personal information/i)
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })
})
