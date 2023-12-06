// eslint-disable-next-line @typescript-eslint/no-var-requires
const { connect, connection } = require('mongoose')

beforeAll(async () => {
  await connect(globalThis.__MONGO_URI__)
})

afterAll(async () => {
  await connection.close()
})
