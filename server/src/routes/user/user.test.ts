import UserModel from '@/model/user'
import { getCredentials, getNewUser } from '@/utils/generate'
import startServer, { type Server } from '@/utils/server'
import { type User } from '@/validation/user'
import axios from 'axios'

const PORT = 3013

describe('user', () => {
  let server: Server
  let user: User

  const api = axios.create({ baseURL: `http://localhost:${PORT}/api/v1` })

  beforeAll(async () => {
    server = await startServer(PORT)
    const { cookie, user: returnedUser } = await getCredentials(PORT, 'admin')
    user = returnedUser
    api.defaults.headers.Cookie = cookie
  })

  afterAll(async () => {
    await server.close()
  })

  beforeEach(async () => {
    await UserModel.deleteMany({ _id: { $ne: user._id } })
  })

  it('should find all users', async () => {
    const user1 = getNewUser()
    const user2 = getNewUser()
    await UserModel.create([user1, user2])
    const response = await api.get('/users')
    expect(response.status).toBe(200)
    const users = response.data
    expect(users.length).toBe(2 + 1) // add the user created in getCredentials
  })
})
