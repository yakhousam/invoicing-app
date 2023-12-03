import { Router } from 'express'
import authRoute from './auth'
import clientRoute from './client'

const rootRouter = Router()

rootRouter.use(authRoute)
rootRouter.use(clientRoute)

export default rootRouter
