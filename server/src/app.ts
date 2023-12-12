import './db'
import express, { type Application } from 'express'
import rootRouter from './routes'
import errorMiddleware from './middlewars/error'

const PORT = process.env.PORT ?? 3000

const app: Application = express()

app.use(express.json())
app.use(rootRouter)

app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`)
})
