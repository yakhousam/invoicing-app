import logger from '@/utils/logger'
import { parseUserSchema, type Role } from '@/validation/user'
import { type NextFunction, type Request, type Response } from 'express'

function withRole(role: Role) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      const user = parseUserSchema.parse(req.user)
      if (user?.role === role) {
        next()
      } else {
        logger.error('Access denied')
        res.sendStatus(403)
      }
    } catch (error) {
      logger.error(error)
      res.sendStatus(500)
    }
  }
}

export const isAdmin = withRole('admin')

export default withRole
