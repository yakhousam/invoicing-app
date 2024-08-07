import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Signature from '../components/settings/Signature'
import { renderWithRouterContext } from './utils/wrappers'

describe('Signature', () => {
  it('renders', async () => {
    renderWithRouterContext({
      component: <Signature />
    })

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /signature/i })
      ).toBeInTheDocument()
    })

    expect(screen.getByText(/update your signature/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/signature/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })
})
