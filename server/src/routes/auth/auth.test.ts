import userModel from '@/model/user'
import { getNewUser } from '@/utils/generate'
import startServer, { type Server } from '@/utils/server'
import { type User } from '@/validation/user'
import axios from 'axios'

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

  describe('register', () => {
    it('should register a new user and return the user object', async () => {
      const api = axios.create({ baseURL })
      const user = getNewUser()
      const response = await api.post<User>('/auth/register', user)
      expect(response.status).toBe(201)
      const returnedUser = response.data
      expect(returnedUser).toHaveProperty('_id')
      expect(returnedUser.userName).toBe(user.userName)
      expect(returnedUser.email).toBe(user.email)
      expect(returnedUser).not.toHaveProperty('password')
    })

    it('should register a new user and return a cookie with a token', async () => {
      const api = axios.create({ baseURL })
      const user = getNewUser()
      const response = await api.post('/auth/register', user)
      expect(response.status).toBe(201)
      const cookies = response.headers['set-cookie']
      const containsToken = cookies?.some((cookie) => cookie.includes('token'))
      expect(containsToken).toBe(true)
    })
  })

  describe('Login', () => {
    it('should login a user and return the user object', async () => {
      const api = axios.create({ baseURL })
      const user = getNewUser()
      // await api.post('/auth/register', user)
      await userModel.create(user)
      const response = await api.post<User>('/auth/login', {
        userName: user.userName,
        password: user.password
      })
      expect(response.status).toBe(200)
      const returnedUser = response.data
      expect(returnedUser).toHaveProperty('_id')
      expect(returnedUser.userName).toBe(user.userName)
      expect(returnedUser.email).toBe(user.email)
      expect(returnedUser).not.toHaveProperty('password')
    })

    it('should login a user and return a cookie with a token', async () => {
      const api = axios.create({ baseURL })
      const user = getNewUser()
      await api.post('/auth/register', user)
      const response = await api.post('/auth/login', {
        userName: user.userName,
        password: user.password
      })
      expect(response.status).toBe(200)
      const cookies = response.headers['set-cookie']
      const containsToken = cookies?.some((cookie) => cookie.includes('token'))
      expect(containsToken).toBe(true)
    })
  })
})
