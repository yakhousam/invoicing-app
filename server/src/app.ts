import errorMiddleware from '@/middlewars/error'
import rootRouter from '@/routes'
import cookieParser from 'cookie-parser'
import express, { type Application } from 'express'
import http from 'http'

const app: Application = express()

app.use(cookieParser())
app.use(express.json())
app.use(rootRouter)

app.use(errorMiddleware)

const server = http.createServer(app)

export default server
