import userController from '@/controllers/user'
import { upload } from '@/middlewares/multer'
import { isAdmin } from '@/middlewares/role'

import { Router, json } from 'express'

const userRoute = Router()

userRoute.get('/users', isAdmin, (req, res, next) => {
  void userController.findAll(req, res, next)
})
userRoute.get('/users/me', (req, res, next) => {
  void userController.findMe(req, res, next)
})

userRoute.put('/users/me/profile', json(), (req, res, next) => {
  void userController.updateMyProfile(req, res, next)
})

userRoute.put('/users/me/password', json(), (req, res, next) => {
  void userController.updateMyPassword(req, res, next)
})

userRoute.put(
  '/users/:id/signature',
  upload.single('signature'),
  (req, res, next) => {
    void userController.updateMySignature(req, res, next)
  }
)

export default userRoute
