import { API_URL } from '@/config'
import { generateClient } from '@/tests/utils/generate'
import { HttpResponse, http, server } from '@/tests/utils/node'
import { Wrapper } from '@/tests/utils/wrappers'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import ClientForm from '../components/client/ClientForm'

describe('ClientForm', () => {
  it('renders', () => {
    render(<ClientForm />, {
      wrapper: Wrapper
    })
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
  })

  it('create client', async () => {
    render(<ClientForm />, {
      wrapper: Wrapper
    })
    const { name, email, address } = generateClient()
    await userEvent.type(screen.getByLabelText(/name/i), name)
    await userEvent.type(screen.getByLabelText(/email/i), email)
    await userEvent.type(screen.getByLabelText(/address/i), address)
    await userEvent.click(screen.getByRole('button', { name: /create/i }))
    // check that the user sees a success message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toHaveTextContent(/client created/i)
    })
    // test that the form is cleared after submission
    expect(screen.getByLabelText(/name/i)).toHaveTextContent('')
    expect(screen.getByLabelText(/email/i)).toHaveTextContent('')
    expect(screen.getByLabelText(/address/i)).toHaveTextContent('')
  })

  it('create client with only a name (no email or address)', async () => {
    render(<ClientForm />, {
      wrapper: Wrapper
    })
    const { name } = generateClient()
    await userEvent.type(screen.getByLabelText(/name/i), name)
    await userEvent.click(screen.getByRole('button', { name: /create/i }))
    // check that the user sees a success message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toHaveTextContent(/client created/i)
    })
    // test that the form is cleared after submission
    expect(screen.getByLabelText(/name/i)).toHaveTextContent('')
    expect(screen.getByLabelText(/email/i)).toHaveTextContent('')
    expect(screen.getByLabelText(/address/i)).toHaveTextContent('')
  })

  it('create client with name and email  but no address ', async () => {
    render(<ClientForm />, {
      wrapper: Wrapper
    })
    const { name, email } = generateClient()
    await userEvent.type(screen.getByLabelText(/name/i), name)
    await userEvent.type(screen.getByLabelText(/email/i), email)
    await userEvent.click(screen.getByRole('button', { name: /create/i }))
    // check that the user sees a success message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toHaveTextContent(/client created/i)
    })
    // test that the form is cleared after submission
    expect(screen.getByLabelText(/name/i)).toHaveTextContent('')
    expect(screen.getByLabelText(/email/i)).toHaveTextContent('')
    expect(screen.getByLabelText(/address/i)).toHaveTextContent('')
  })

  it('create client with name and address but no email', async () => {
    render(<ClientForm />, {
      wrapper: Wrapper
    })
    const { name, address } = generateClient()
    await userEvent.type(screen.getByLabelText(/name/i), name)
    await userEvent.type(screen.getByLabelText(/address/i), address)
    await userEvent.click(screen.getByRole('button', { name: /create/i }))
    // check that the user sees a success message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toHaveTextContent(/client created/i)
    })
    // test that the form is cleared after submission
    expect(screen.getByLabelText(/name/i)).toHaveTextContent('')
    expect(screen.getByLabelText(/email/i)).toHaveTextContent('')
    expect(screen.getByLabelText(/address/i)).toHaveTextContent('')
  })

  describe('Form validation', () => {
    it('show error on duplicate name', async () => {
      server.use(
        http.post(API_URL.clients.createOne, async ({ request }) => {
          const { name } = (await request.json()) as { name: string }
          return HttpResponse.json(
            {
              error: 'DuplicateKeyError',
              message: 'message',
              field: 'name',
              value: name
            },
            { status: 409 }
          )
        })
      )
      const { email, name } = generateClient()
      render(<ClientForm />, {
        wrapper: Wrapper
      })
      await userEvent.type(screen.getByLabelText(/name/i), name)
      await userEvent.type(screen.getByLabelText(/email/i), email)
      await userEvent.click(screen.getByRole('button', { name: /create/i }))
      await screen.findByText(/a client with the same name already exists/i)
    })

    it('show error on duplicate email', async () => {
      server.use(
        http.post(API_URL.clients.createOne, async ({ request }) => {
          const { email } = (await request.json()) as { email: string }
          return HttpResponse.json(
            {
              error: 'DuplicateKeyError',
              message: 'message',
              field: 'email',
              value: email
            },
            { status: 409 }
          )
        })
      )
      const { email, name } = generateClient()
      render(<ClientForm />, {
        wrapper: Wrapper
      })
      await userEvent.type(screen.getByLabelText(/name/i), name)
      await userEvent.type(screen.getByLabelText(/email/i), email)
      await userEvent.click(screen.getByRole('button', { name: /create/i }))
      await screen.findByText(/a client with the same email already exists/i)
    })

    it('show error on invalid email', async () => {
      const { name } = generateClient()
      render(<ClientForm />, {
        wrapper: Wrapper
      })
      await userEvent.type(screen.getByLabelText(/name/i), name)
      await userEvent.type(screen.getByLabelText(/email/i), 'invalid-email')
      await userEvent.click(screen.getByRole('button', { name: /create/i }))
      await screen.findByText(/invalid email/i)
    })

    it('show error on empty name', async () => {
      const { email } = generateClient()
      render(<ClientForm />, {
        wrapper: Wrapper
      })
      await userEvent.type(screen.getByLabelText(/email/i), email)
      await userEvent.click(screen.getByRole('button', { name: /create/i }))
      await screen.findByText(/name is required/i)
    })

    it('show error on server error', async () => {
      server.use(
        http.post(API_URL.clients.createOne, async () => {
          return HttpResponse.error()
        })
      )
      const { email, name } = generateClient()
      render(<ClientForm />, {
        wrapper: Wrapper
      })
      await userEvent.type(screen.getByLabelText(/name/i), name)
      await userEvent.type(screen.getByLabelText(/email/i), email)
      await userEvent.click(screen.getByRole('button', { name: /create/i }))
      await screen.findByText(/error creating client/i)
    })
  })
})
