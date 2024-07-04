import InvoiceModel from '@/model/invoice'
import UserModel, { hashPassword } from '@/model/user'
import logger from '@/utils/logger'
import {
  parseUserSchema,
  updateUserPasswordSchema,
  updateUserSchema,
  type UpdateUser,
  type User
} from '@/validation/user'
import { type NextFunction, type Request, type Response } from 'express'
import fs from 'fs'
import path from 'path'

export type UserUpdateType = Request<
  { id: string },
  Record<string, unknown>,
  UpdateUser
>

const findAll = async (
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

const findOne = async (
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

const findUserInvoices = async (
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

const updateMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updates = updateUserSchema.parse(req.body)
    const authenticatedUser = parseUserSchema.parse(req.user)

    if (updates.userName !== undefined) {
      const userWithSameUserName = await UserModel.findOne({
        userName: updates.userName,
        _id: { $ne: authenticatedUser._id }
      })
      if (userWithSameUserName !== null) {
        res.status(409).json({
          error: 'Conflict',
          message: `User with username: ${updates.userName} already exists`
        })
        return
      }
    }

    const user = await UserModel.findOneAndUpdate<User>(
      {
        _id: authenticatedUser._id
      },
      {
        ...updates
      },
      {
        new: true
      }
    )
    res.status(201).json(user)
  } catch (error: unknown) {
    next(error)
  }
}

const updateMySignature = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authenticatedUser = parseUserSchema.parse(req.user)

    // Delete the old user signature image
    if (authenticatedUser.signatureUrl !== undefined) {
      const filePath = path.join(process.cwd(), authenticatedUser.signatureUrl)
      try {
        await fs.promises.access(filePath, fs.constants.F_OK)
        await fs.promises.unlink(filePath)
      } catch (error) {
        logger.error(error)
      }
    }

    const user = await UserModel.findOneAndUpdate<User>(
      {
        _id: authenticatedUser._id
      },
      {
        signatureUrl: req.file?.path
      },
      {
        new: true
      }
    )
    const updatedUser = parseUserSchema.parse(user)
    res.status(201).json(updatedUser)
  } catch (error: unknown) {
    next(error)
  }
}

const updateMyPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { _id: userId } = parseUserSchema.parse(req.user)
    const { oldPassword, newPassword } = updateUserPasswordSchema.parse(
      req.body
    )
    const user = await UserModel.findById(userId)
    if (user === null) {
      res.status(404).json({
        error: 'Not found',
        message: `User with id: ${userId} doesn't exist`
      })
      return
    }
    const isOldPasswordMatchUserPassword =
      await user.isValidPassword(oldPassword)

    if (!isOldPasswordMatchUserPassword) {
      res
        .status(403)
        .json({ filed: 'oldPassword', message: 'Old password does not match.' })
      return
    }

    const hashedPassword = await hashPassword(newPassword)
    await UserModel.findOneAndUpdate<User>(
      {
        _id: userId
      },
      {
        password: hashedPassword
      },
      {
        new: true
      }
    )

    res
      .clearCookie('token')
      .status(201)
      .json({ message: 'Password updated successfully. Please log in again.' })
  } catch (error) {
    next(error)
  }
}

// TODO: remove param id: use authenticated user
const deleteMyAccount = async (
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
  findAll,
  findOne,
  findMe,
  findUserInvoices,
  deleteMyAccount,
  updateMyProfile,
  updateMySignature,
  updateMyPassword
}

export default userController
