import { jwtAuthMiddleware } from '@/middlewares/auth'
import { Router } from 'express'
import authRoute from './auth'
import clientRoute from './client'
import invoiceRoute from './invoice'
import userRoute from './user'

const rootRouter = Router()

rootRouter.use(authRoute)

rootRouter.use(jwtAuthMiddleware)

rootRouter.use(userRoute)
rootRouter.use(clientRoute)
rootRouter.use(invoiceRoute)

export default rootRouter
