import userModel, { type User } from '@/model/user'
import { getNewUser } from '@/utils/generate'
import startServer, { type Server } from '@/utils/server'
import axios from 'axios'

export type ReturnedUser = User & { _id: string }

const PORT = 3010

describe('auth', () => {
  let server: Server
  beforeAll(async () => {
    server = await startServer(PORT)
  })

  afterAll(async () => {
    await server.close()
  })

  beforeEach(async () => {
    await userModel.deleteMany({})
  })

  const baseURL = `http://localhost:${PORT}/api/v1`

  describe('signup', () => {
    it('should signup a new user and return the user object', async () => {
      const api = axios.create({ baseURL })
      const user = getNewUser()
      const response = await api.post<ReturnedUser>('/auth/signup', user)
      expect(response.status).toBe(201)
      const returnedUser = response.data
      expect(returnedUser).toHaveProperty('_id')
      expect(returnedUser.name).toBe(user.name)
      expect(returnedUser.email).toBe(user.email)
      expect(returnedUser).not.toHaveProperty('password')
    })

    it('should signup a new user and return a cookie with a token', async () => {
      const api = axios.create({ baseURL })
      const user = getNewUser()
      const response = await api.post('/auth/signup', user)
      expect(response.status).toBe(201)
      const cookies = response.headers['set-cookie']
      const containsToken = cookies?.some((cookie) => cookie.includes('token'))
      expect(containsToken).toBe(true)
    })
  })

  describe('Signin', () => {
    it('should signin a user and return the user object', async () => {
      const api = axios.create({ baseURL })
      const user = getNewUser()
      // await api.post('/auth/signup', user)
      await userModel.create(user)
      const response = await api.post<ReturnedUser>('/auth/signin', {
        name: user.name,
        password: user.password
      })
      expect(response.status).toBe(200)
      const returnedUser = response.data
      expect(returnedUser).toHaveProperty('_id')
      expect(returnedUser.name).toBe(user.name)
      expect(returnedUser.email).toBe(user.email)
      expect(returnedUser).not.toHaveProperty('password')
    })

    it('should signin a user and return a cookie with a token', async () => {
      const api = axios.create({ baseURL })
      const user = getNewUser()
      await api.post('/auth/signup', user)
      const response = await api.post('/auth/signin', {
        name: user.name,
        password: user.password
      })
      expect(response.status).toBe(200)
      const cookies = response.headers['set-cookie']
      const containsToken = cookies?.some((cookie) => cookie.includes('token'))
      expect(containsToken).toBe(true)
    })
  })
})
