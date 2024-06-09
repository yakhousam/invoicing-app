import mongoose from 'mongoose'
import { z } from 'zod'

export const objectIdSchema = z
  .string()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: 'Invalid ObjectId'
  })

export const objectIdToString = z.preprocess((val: any) => {
  if (val instanceof mongoose.Types.ObjectId) {
    return val.toString()
  }
  return val
}, z.string())

export const dateToZodDate = z.preprocess(
  (val: any) => {
    if (val instanceof Date) {
      return val.toISOString()
    }
    return val
  },
  z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format'
  })
)
