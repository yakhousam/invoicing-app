import cookieParser from 'cookie-parser'
import express, { type Application } from 'express'
import './db'
import errorMiddleware from './middlewars/error'
import rootRouter from './routes'

const PORT = process.env.PORT ?? 3000

const app: Application = express()

app.use(cookieParser())
app.use(express.json())
app.use(rootRouter)

app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`)
})
