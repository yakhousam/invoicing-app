import { ZodError } from 'zod'
import { Error as MongooseError } from 'mongoose'

import { type NextFunction, type Request, type Response } from 'express'

function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (error instanceof ZodError) {
    res
      .status(400)
      .json({ errors: error.flatten().fieldErrors, message: 'Missing Fields.' })
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
  } else {
    res.sendStatus(500)
  }
}

export default errorMiddleware
