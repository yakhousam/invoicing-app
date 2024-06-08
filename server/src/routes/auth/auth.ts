import authController from '@/controllers/auth'
import { Router, json } from 'express'
import passport from 'passport'

const authRoute = Router()
authRoute.use(json())

authRoute.post('/auth/signup', (req, res, next) => {
  void authController.signup(req, res, next)
})

authRoute.post(
  '/auth/signin',
  passport.authenticate('local', { session: false }),
  authController.signin
)

authRoute.post('/auth/signout', (req, res) => {
  authController.signout(req, res)
})

export default authRoute
