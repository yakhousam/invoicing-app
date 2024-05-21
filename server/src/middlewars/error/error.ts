import { MongoServerError } from 'mongodb'
import { Error as MongooseError } from 'mongoose'
import { ZodError } from 'zod'

import { type NextFunction, type Request, type Response } from 'express'

function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (error instanceof ZodError) {
    res.status(400).json({ errors: error.flatten().fieldErrors, message: '' })
  } else if (error instanceof MongooseError.CastError) {
    res.status(400).json({
      error: `${error.path}`,
      message: `${error.value} : is not a valid id`
    })
  } else if (error instanceof MongooseError.ValidationError) {
    res.status(400).json({
      error: error.name,
      message: error.message
    })
  } else if (error instanceof MongoServerError && error.code === 11000) {
    const mongoError = error as MongoServerError & {
      keyPattern: any
      keyValue: any
    }
    const fieldName = Object.keys(mongoError.keyPattern)[0]
    const fieldValue = mongoError.keyValue[fieldName]
    res.status(409).json({
      error: 'DuplicateKeyError',
      message: `A document with the same ${fieldName} already exists: ${fieldValue}.`,
      field: fieldName,
      value: fieldValue
    })
  } else {
    res.sendStatus(500)
  }
}

export default errorMiddleware
