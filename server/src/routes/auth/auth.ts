import authController from '@/controllers/auth'
import { Router, json } from 'express'
import passport from 'passport'

const authRoute = Router()
authRoute.use(json())

authRoute.post('/auth/register', (req, res, next) => {
  void authController.register(req, res, next)
})

authRoute.post(
  '/auth/login',
  passport.authenticate('local', { session: false }),
  authController.login
)

authRoute.post('/auth/logout', (req, res) => {
  authController.logout(req, res)
})

export default authRoute
