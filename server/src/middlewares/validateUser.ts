import { type Request, type Response, type NextFunction } from 'express'
import { zodUserShema } from '../model/user'

export const validateUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    zodUserShema.parse(req.body)
    next()
  } catch (error) {
    console.error(error)
    res.sendStatus(400)
  }
}
