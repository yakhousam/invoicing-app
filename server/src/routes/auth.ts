import { Router } from 'express'
import userContorller from '@/controllers/user'

const userRoute = Router()

userRoute.post('/auth/signup', (req, res, next) => {
  void userContorller.create(req, res, next)
})

export default userRoute
