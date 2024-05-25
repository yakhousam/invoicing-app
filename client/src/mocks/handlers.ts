import { baseUrl } from '@/config'
import { http, HttpResponse } from 'msw'
import { generateUser } from './helpers'

export const handlers = [
  http.post(`${baseUrl}/auth/signin`, async () => {
    return HttpResponse.json(generateUser())
  })
]
