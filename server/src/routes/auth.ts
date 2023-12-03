import { Router } from 'express'
import User from '../controllers/user'

const userRoute = Router()

userRoute.post('/auth/signup', User.create)

export default userRoute
