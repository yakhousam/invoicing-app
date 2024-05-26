import { API_URL } from '@/config'
import { http, HttpResponse } from 'msw'
import { generateClient, generateUser } from './helpers'
export const handlers = [
  http.post(API_URL.auth.login, async () => {
    return HttpResponse.json(generateUser())
  }),
  http.post(API_URL.clients.createOne, () => {
    return HttpResponse.json(generateClient())
  })
]
