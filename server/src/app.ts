import errorMiddleware from '@/middlewars/error'
import rootRouter from '@/routes'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { type Application } from 'express'
import http from 'http'

const app: Application = express()

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
)
app.use(cookieParser())
app.use('/api/v1', rootRouter)

app.use('/uploads', express.static('uploads'))

app.use(errorMiddleware)

const server = http.createServer(app)

export default server
