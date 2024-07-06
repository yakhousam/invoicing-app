import { API_URL } from '@/config'
import { HttpResponse, http, server } from '@/tests/utils/node'
import { CreateInvoice, Invoice } from '@/validations'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import CreateInvoiceForm from '../components/invoice/CreateInvoiceForm'
import { generateClient, generateInvoice } from './utils/generate'
import { Wrapper } from './utils/wrappers'

describe('CreateInvoiceForm', () => {
  it('renders', async () => {
    render(<CreateInvoiceForm />, { wrapper: Wrapper })

    expect(
      await screen.findByLabelText(/invoice due days/i)
    ).toBeInTheDocument()

    expect(screen.getByLabelText(/invoice date/i)).toHaveValue(
      dayjs().format('YYYY-MM-DD')
    )
    expect(screen.getByLabelText(/client/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/currency/i)).toHaveTextContent('EUR')
    expect(screen.getByLabelText(/tax percentage/i)).toHaveValue(0)

    expect(
      screen.getByRole('heading', { name: /invoice items/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /add item/i })
    ).toBeInTheDocument()

    expect(screen.getByLabelText(/description/i)).toHaveValue('')
    expect(screen.getByLabelText(/price/i)).toHaveValue(0)
    expect(screen.getByLabelText(/quantity/i)).toHaveValue(1)

    expect(
      screen.getByRole('button', { name: /delete item/i })
    ).toBeInTheDocument()

    expect(screen.getByRole('heading', { name: /total/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/sub total/i)).toHaveTextContent('€0.00')
    expect(screen.getByLabelText(/total tax/i)).toHaveTextContent('€0.00')
    expect(screen.getByLabelText(/grand total/i)).toHaveTextContent('€0.00')

    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
  })

  it('create invoice', async () => {
    const user = userEvent.setup()

    const mockClient = { ...generateClient(), name: 'john doe' }
    const mockInvoice: Invoice = {
      ...generateInvoice(),
      client: mockClient,
      invoiceDate: dayjs('2022-01-01').toISOString()
    }

    let postedInvoice: Partial<CreateInvoice> = {}
    server.use(
      http.get(API_URL.clients.getMany, () => {
        const clients = [
          ...Array.from({ length: 9 }, () => generateClient()),
          mockClient
        ]
        return HttpResponse.json(clients)
      }),
      http.post(API_URL.invoices.createOne, async ({ request }) => {
        postedInvoice = (await request.json()) as CreateInvoice
        return HttpResponse.json(generateInvoice())
      })
    )

    render(<CreateInvoiceForm />, { wrapper: Wrapper })

    expect(
      await screen.findByLabelText(/invoice due days/i)
    ).toBeInTheDocument()

    await user.clear(screen.getByLabelText(/invoice due days/i))
    await user.type(
      screen.getByLabelText(/invoice due days/i),
      mockInvoice.invoiceDueDays.toString()
    )

    const invoiceDateInput = screen.getByLabelText(/invoice date/i)
    // I couldn't use user.type here because apparently it doesn't work with mui date inputs
    fireEvent.change(invoiceDateInput, {
      target: { value: dayjs(mockInvoice.invoiceDate).format('YYYY-MM-DD') }
    })

    // select a client
    const selectClientElement = screen.getByRole('combobox', {
      name: /client/i
    }) as HTMLSelectElement
    await user.click(selectClientElement)
    await user.click(await screen.findByText(mockInvoice.client.name))
    //

    // select currency
    if (mockInvoice.currency !== 'EUR') {
      const currencySelectElement = screen.getByRole('combobox', {
        name: /currency/i
      }) as HTMLSelectElement
      await user.click(currencySelectElement)
      await user.click(await screen.findByText(mockInvoice.currency))
    }
    //

    await user.clear(screen.getByLabelText(/tax percentage/i))
    await user.type(
      screen.getByLabelText(/tax percentage/i),
      mockInvoice.taxPercentage.toString()
    )

    await user.type(
      screen.getByLabelText(/description/i),
      mockInvoice.items[0].itemName
    )
    await user.type(
      screen.getByLabelText(/price/i),
      mockInvoice.items[0].itemPrice.toString()
    )
    await user.clear(screen.getByLabelText(/quantity/i))
    await user.type(
      screen.getByLabelText(/quantity/i),
      mockInvoice.items[0].itemQuantity.toString()
    )

    await user.click(screen.getByRole('button', { name: /create invoice/i }))

    // check that the user sees a success message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toHaveTextContent(/invoice created/i)
    })

    // check that the invoice was posted correctly

    expect(postedInvoice?.invoiceDueDays).toBe(mockInvoice.invoiceDueDays)
    expect(postedInvoice?.invoiceDate).toBe(mockInvoice.invoiceDate)
    expect(postedInvoice?.client?._id).toBe(mockInvoice.client._id)
    expect(postedInvoice?.currency).toBe(mockInvoice.currency)
    expect(postedInvoice?.taxPercentage).toBe(mockInvoice.taxPercentage)
    expect(postedInvoice?.items?.[0].itemName).toBe(
      mockInvoice.items[0].itemName
    )
    expect(postedInvoice?.items?.[0].itemPrice).toBe(
      mockInvoice.items[0].itemPrice
    )
    expect(postedInvoice?.items?.[0].itemQuantity).toBe(
      mockInvoice.items[0].itemQuantity
    )

    // test that the form is cleared after submission
    expect(screen.getByLabelText(/invoice due days/i)).toHaveValue(7)
    expect(screen.queryByText(mockInvoice.client.name)).toBeNull()
    expect(screen.getByLabelText(/currency/i)).toHaveTextContent('EUR')
    expect(screen.getByLabelText(/tax percentage/i)).toHaveValue(0)
    expect(screen.getByLabelText(/description/i)).toHaveTextContent('')
    expect(screen.getByLabelText(/price/i)).toHaveValue(0)
    expect(screen.getByLabelText(/quantity/i)).toHaveValue(1)
  }, 10000)
})
