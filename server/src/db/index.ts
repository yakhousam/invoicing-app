import logger from '@/utils/logger'
import { connect, connection } from 'mongoose'

const dbUri =
  process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/invoicing-app'

connection.on('connected', () => {
  logger.info('Mongoose is connected to ', dbUri)
})

connection.on('error', (err) => {
  logger.error(err)
})

connection.on('disconnected', () => {
  logger.info('Mongoose is disconnected')
})

process.on('SIGINT', () => {
  logger.info('Mongoose disconnected on exit process')
  process.exit(0)
})

export default connect(dbUri)
