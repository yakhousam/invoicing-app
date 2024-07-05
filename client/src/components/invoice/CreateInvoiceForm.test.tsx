import { renderWithContext } from '@/mocks/utils'
import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CreateInvoiceForm from './CreateInvoiceForm'

describe('CreateInvoiceForm', () => {
  it('renders', async () => {
    renderWithContext({
      component: <CreateInvoiceForm />
    })

    await waitFor(() => {
      expect(screen.getByLabelText(/invoice due days/i)).toBeInTheDocument()
    })

    expect(screen.getByLabelText(/invoice date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/client/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/currency/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/tax percentage/i)).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: /invoice items/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /add item/i })
    ).toBeInTheDocument()

    expect(screen.getByLabelText(/price/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /delete item/i })
    ).toBeInTheDocument()

    expect(screen.getByRole('heading', { name: /total/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/sub total/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/total tax/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/grand total/i)).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
  })
})
