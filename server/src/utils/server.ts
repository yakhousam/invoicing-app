/* eslint-disable @typescript-eslint/promise-function-async */
import server from '@/app'
import logger from '@/utils/logger'
import { type Server as HttpServer } from 'http'

export type Server = Omit<HttpServer, 'close'> & {
  close: () => Promise<void>
}

const testServer = server as unknown as Server

// Making the server start and close asynchronously allows us to wait for it in our tests.
// Inspired by the approach used by Kent C. Dodds: https://github.com/kentcdodds/testing-node-apps/blob/bd4708e926e83571d070d84f25b49ab6ca10d00a/src/start.js#L22
const startServer = (port: number): Promise<Server> => {
  return new Promise<Server>((resolve) => {
    testServer.listen(port, () => {
      logger.info(`Test Server is running on port ${port}`)
      const originalClose = server.close.bind(testServer)
      testServer.close = (): Promise<void> => {
        return new Promise((resolve) => {
          logger.info('Test Server closed')
          originalClose(resolve as () => void)
        })
      }
      resolve(testServer)
    })
  })
}

export default startServer
