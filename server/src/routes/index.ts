import { Router } from 'express'
import authRoute from './auth'

const rootRouter = Router()

rootRouter.use(authRoute)

export default rootRouter
