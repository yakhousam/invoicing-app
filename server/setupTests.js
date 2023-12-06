import { connect, connection } from 'mongoose'

jest.beforeAll(async () => {
  await connect(globalThis.__MONGO_URI__)
})

jest.afterAll(async () => {
  await connection.close()
})
