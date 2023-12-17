import userModel, { type User } from '@/model/user'
import { getNewUser } from '@/utils/generate'
import startServer, { type Server } from '@/utils/server'

describe('auth', () => {
  let myServer: Server
  beforeAll(async () => {
    myServer = await startServer(3008)
  })

  afterAll(async () => {
    await myServer.close()
  })

  beforeEach(async () => {
    await userModel.deleteMany({})
  })

  it('should signup a new user, return json user object', async () => {
    const mockUser = getNewUser()
    const response = await fetch('http://localhost:3008/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mockUser)
    })
    const user = (await response.json()) as User
    expect(response.status).toBe(201)
    expect(user).toHaveProperty('_id')
    expect(user.name).toBe(mockUser.name)
    expect(user.email).toBe(mockUser.email)
    expect(user).not.toHaveProperty('password')
  })

  it('should signup a new user, return cookie with token', async () => {
    const mockUser = getNewUser()
    const response = await fetch('http://localhost:3008/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mockUser)
    })
    expect(response.status).toBe(201)
    const cookies = response.headers.get('set-cookie')
    expect(cookies).toContain('token=')
  })
})
