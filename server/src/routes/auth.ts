import { Router } from 'express'
import authController from '@/controllers/auth'
import passport from 'passport'

const authRoute = Router()

authRoute.post('/auth/signup', (req, res, next) => {
  void authController.signup(req, res, next)
})

authRoute.post(
  '/auth/signin',
  passport.authenticate('local', { session: false }),
  authController.signin
)

export default authRoute
