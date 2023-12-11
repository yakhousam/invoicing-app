import { connect, connection } from 'mongoose'

const dbUri =
  process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/invoicing-app'

connection.on('connected', () => {
  console.log('Mongoose is connected to ', dbUri)
})

connection.on('error', (err) => {
  console.log(err)
})

connection.on('disconnected', () => {
  console.log('Mongoose is disconnected')
})

process.on('SIGINT', () => {
  console.log('Mongoose disconnected on exit process')
  process.exit(0)
})

export default connect(dbUri)
