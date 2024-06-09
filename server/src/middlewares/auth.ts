import passport from 'passport'

export const jwtAuthMiddleware = passport.authenticate('jwt', {
  session: false
})
