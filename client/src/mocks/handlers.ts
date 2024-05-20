import { baseUrl } from '@/config'
import { http, HttpResponse } from 'msw'
import { generateUser } from './helpers'

export const handlers = [
  // Intercept "GET https://example.com/user" requests...
  http.post(`${baseUrl}/auth/signin`, async ({ request }) => {
    // ...and respond to them using this JSON response.
    const { password } = (await request.json()) as {
      password: string
    }
    if (password !== 'wrongpassword') {
      return HttpResponse.json(generateUser())
    } else {
      return new HttpResponse(null, { status: 401 })
    }
  })
]
