import { type Request, type Response, type NextFunction } from 'express'
import UserModel, { type UserType, zodUserShema } from '@/model/user'

export type CreateUserRequest = Request<Record<string, unknown>, Record<string, unknown>, UserType>
export type UserFindByIdType = Request<{ id: string }, Record<string, unknown>, Record<string, unknown>>
export type UserUpdateType = UserFindByIdType & CreateUserRequest

const create = async (req: CreateUserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    zodUserShema.parse(req.body)
    const { name, email, password } = req.body
    const user = new UserModel({ name, email, password })
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch (error) {
    next(error)
  }
}

const find = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await UserModel.find()
    res.status(200).json(users)
  } catch (error: unknown) {
    next(error)
  }
}

const findById = async (req: UserFindByIdType, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const user = await UserModel.findById(id)
    if (user !== null) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ error: 'Not found', message: `User with id: ${id} doesn't exist` })
    }
  } catch (error: unknown) {
    next(error)
  }
}

const update = async (req: UserUpdateType, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const { name, email, password } = req.body

    const user = await UserModel.findById(id)

    if (user !== null) {
      zodUserShema.parse({ name, email, password })
      user.name = name
      user.email = email
      user.password = password

      const updatedUser = await user.save()
      res.status(200).json(updatedUser)
    } else {
      res.status(404).json({ error: 'Not found', message: `User with id: ${id} doesn't exist` })
    }
  } catch (error: unknown) {
    next(error)
  }
}

const deleteById = async (req: UserFindByIdType, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const user = await UserModel.findByIdAndDelete(id)
    if (user !== null) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ error: 'Not found', message: `User with id: ${id} doesn't exist` })
    }
  } catch (error: unknown) {
    next(error)
  }
}

const userController = {
  create,
  find,
  findById,
  update,
  deleteById
}

export default userController
