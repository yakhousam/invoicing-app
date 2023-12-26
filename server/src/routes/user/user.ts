import userController from '@/controllers/user'
import { isAdmin } from '@/middlewars/role'

import { Router } from 'express'

const userRoute = Router()

userRoute.get('/users', isAdmin, (req, res, next) => {
  void userController.find(req, res, next)
})

export default userRoute
