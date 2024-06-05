import InvoiceModel from '@/model/invoice'
import UserModel from '@/model/user'
import logger from '@/utils/logger'
import {
  parseUserSchema,
  updateUserSchema,
  type UpdateUser,
  type User
} from '@/validation/user'
import { type NextFunction, type Request, type Response } from 'express'

export type UserUpdateType = Request<
  { id: string },
  Record<string, unknown>,
  UpdateUser
>

const find = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await UserModel.find()
    res.status(200).json(users)
  } catch (error: unknown) {
    next(error)
  }
}

const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const user = await UserModel.findById(id)
    if (user !== null) {
      res.status(200).json(user)
    } else {
      res.status(404).json({
        error: 'Not found',
        message: `User with id: ${id} doesn't exist`
      })
    }
  } catch (error: unknown) {
    next(error)
  }
}

const findInvoices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const invoices = await InvoiceModel.find({ user: id })
      .populate('user')
      .populate('client')
    if (invoices !== null) {
      res.status(200).json(invoices)
    } else {
      res.status(404).json({
        error: 'Not found',
        message: `No invoices for user with id: ${id}`
      })
    }
  } catch (error: unknown) {
    next(error)
  }
}

const updateById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const { name, email, password } = updateUserSchema.parse(req.body)
    const authenticatedUser = parseUserSchema.parse(req.user)
    logger.info(authenticatedUser._id, id)
    if (authenticatedUser._id !== id) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own user'
      })
      return
    }
    const user = await UserModel.findOneAndUpdate<User>(
      {
        _id: id
      },
      {
        name,
        email,
        password
      },
      {
        new: true
      }
    )
    if (user !== null) {
      res.status(200).json(user)
    } else {
      res.status(404).json({
        error: 'Not found',
        message: `User with id: ${id} doesn't exist`
      })
    }
  } catch (error: unknown) {
    next(error)
  }
}

const deleteById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const user = await UserModel.findByIdAndDelete(id)
    if (user !== null) {
      res.status(200).json(user)
    } else {
      res.status(404).json({
        error: 'Not found',
        message: `User with id: ${id} doesn't exist`
      })
    }
  } catch (error: unknown) {
    next(error)
  }
}

const findMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { user } = req
    res.status(200).json(user)
  } catch (error: unknown) {
    next(error)
  }
}

const userController = {
  find,
  findById,
  findInvoices,
  deleteById,
  findMe,
  updateById
}

export default userController
