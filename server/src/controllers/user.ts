import { type Request, type Response } from 'express'
import UserModel, { type UserType, zodUserShema } from '@/model/user'

type CreateUserRequest = Request<Record<string, unknown>, Record<string, unknown>, UserType>

const create = (req: CreateUserRequest, res: Response): void => {
  try {
    zodUserShema.parse(req.body)
    const { name, email, password } = req.body
    const user = new UserModel({ name, email, password })
    user.save()
      .then(user => res.status(201).json(user))
      .catch((e) => res.status(409).json(e))
  } catch (error) {
    console.error(error)
    res.sendStatus(400)
  }
}

const User = {
  create
}

export default User
