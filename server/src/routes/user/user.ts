import userController from '@/controllers/user'
import { upload } from '@/middlewars/multer'
import { isAdmin } from '@/middlewars/role'

import { Router, json } from 'express'

const userRoute = Router()

userRoute.get('/users', isAdmin, (req, res, next) => {
  void userController.find(req, res, next)
})
userRoute.get('/users/me', (req, res, next) => {
  void userController.findMe(req, res, next)
})

userRoute.put('/users/:id/profile', json(), (req, res, next) => {
  void userController.updateUserProfile(req, res, next)
})
userRoute.put(
  '/users/:id/signature',
  upload.single('signature'),
  (req, res, next) => {
    void userController.updateUserSignature(req, res, next)
  }
)

export default userRoute
