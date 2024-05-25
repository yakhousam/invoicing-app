import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

const server = setupServer(...handlers)

export { http, HttpResponse, server }
