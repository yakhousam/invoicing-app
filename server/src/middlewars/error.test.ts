/* eslint-disable @typescript-eslint/unbound-method */
import { buildNext, buildRes } from '@/utils/generate'
import { type NextFunction, type Request, type Response } from 'express'
import { Error as MongooseError } from 'mongoose'
import { ZodError } from 'zod'
import errorMiddleware from './error'

describe('errorMiddleware', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    req = {} as unknown as Request
    res = buildRes()
    next = buildNext()
  })

  it('should handle ZodError', () => {
    const error = new ZodError([])
    errorMiddleware(error, req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      errors: {},
      message: 'Missing Fields.'
    })
  })

  it('should handle MongooseError.CastError', () => {
    const error = new MongooseError.CastError('type', 'value', 'path')
    errorMiddleware(error, req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'path',
      message: 'value : is not a valid id'
    })
  })

  it('should handle MongooseError.ValidationError', () => {
    const error = new MongooseError.ValidationError()
    errorMiddleware(error, req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: error.name,
      message: error.message
    })
  })

  it('should handle other errors', () => {
    const error = new Error()
    errorMiddleware(error, req, res, next)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})
