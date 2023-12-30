import { parseUserSchema } from '@/validation/user'
import { type NextFunction, type Request, type Response } from 'express'

export type Role = 'admin' | 'user'

function withRole(role: Role) {
  return function (req: Request, res: Response, next: NextFunction) {
    const user = parseUserSchema.parse(req.user)
    if (user?.role === role) {
      next()
    } else {
      res.sendStatus(403)
    }
  }
}

export const isAdmin = withRole('admin')

export default withRole
