import { type Request, type Response } from 'express'
import UserModel from '../model/user'

export const register = (req: Request, res: Response): void => {
  const { name, email, password } = req.body
  const user = new UserModel({ name, email, password })
  user.save()
    .then(user => res.status(201).json(user))
    .catch(() => res.sendStatus(409))
}
