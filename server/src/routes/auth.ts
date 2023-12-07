import { Router } from 'express'
import userContorller from '@/controllers/user'

const userRoute = Router()

userRoute.post('/auth/signup', userContorller.create)

export default userRoute
