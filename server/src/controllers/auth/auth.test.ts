/* eslint-disable @typescript-eslint/unbound-method */
import authController from '@/controllers/auth'
import UserModel from '@/model/user'
import { buildNext, buildRes, getNewUser } from '@/utils/generate'
import { parseUserSchema } from '@/validation/user'
import { type Request } from 'express'
import { Error as MongooseError } from 'mongoose'
import { ZodError } from 'zod'

describe('Auth Controller', () => {
  describe('Signup', () => {
    it('should register a new user', async () => {
      const mockUser = getNewUser()
      const req = {
        body: mockUser
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await authController.register(req, res, next)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.cookie).toHaveBeenCalledWith('token', expect.any(String), {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      })

      const user = parseUserSchema.parse(
        (res.json as jest.Mock).mock.calls[0][0]
      )
      expect(user.name).toBe(mockUser.name)
      expect(user.email).toBe(mockUser.email)
      expect(user).not.toHaveProperty('password')

      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with ZodError error, required name', async () => {
      const req = {
        body: {
          ...getNewUser(),
          name: undefined
        }
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await authController.register(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(ZodError))
    })

    it('should return status 400, invalid email', async () => {
      const req = {
        body: {
          ...getNewUser(),
          email: 'invalid email'
        }
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await authController.register(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(ZodError))
    })

    it('should return status 400, email already exists', async () => {
      const mockUser = getNewUser()
      await UserModel.create(mockUser)

      const req = {
        body: {
          ...mockUser
        }
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await authController.register(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(MongooseError))
    })
  })

  describe('Login', () => {
    it('should sign a token and return user object', async () => {
      // The authController.login function is invoked by passport.js upon successful sign-in.
      // Its sole responsibility is to generate a token, place it in a cookie, and send the user in JSON format.

      const mockUser = getNewUser()
      const createdUser = await UserModel.create(mockUser)

      const req = {
        user: parseUserSchema.parse(createdUser.toJSON())
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      authController.login(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.cookie).toHaveBeenCalledWith('token', expect.any(String), {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      })

      const user = parseUserSchema.parse(
        (res.json as jest.Mock).mock.calls[0][0]
      )

      expect(user.name).toBe(mockUser.name)
      expect(user.email).toBe(mockUser.email)
      expect(user).not.toHaveProperty('password')

      expect(next).not.toHaveBeenCalled()
    })
  })
})
