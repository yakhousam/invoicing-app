import { Router } from 'express'
import authRoute from './auth'
import clientRoute from './client'
import invoiceRoute from './invoice'

const rootRouter = Router()

rootRouter.use(authRoute)
rootRouter.use(clientRoute)
rootRouter.use(invoiceRoute)

export default rootRouter
