/* eslint-disable @typescript-eslint/unbound-method */
import authController, { type AuthSignupRequest } from '@/controllers/auth'
import UserModel, { type User } from '@/model/user'
import { buildNext, buildRes, getNewUser, getObjectId } from '@/utils/generate'
import { type Request } from 'express'
import { Error as MongooseError } from 'mongoose'
import { ZodError } from 'zod'

describe('Auth Controller', () => {
  describe('Signup', () => {
    it('should signup a new user', async () => {
      const mockUser = getNewUser()

      const req = {
        body: mockUser
      } as unknown as AuthSignupRequest

      const res = buildRes()
      const next = buildNext()

      await authController.signup(req, res, next)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.cookie).toHaveBeenCalledWith('token', expect.any(String), {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      })

      const user = (res.json as jest.Mock).mock.calls[0][0] as User
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
      } as unknown as AuthSignupRequest

      const res = buildRes()
      const next = buildNext()

      await authController.signup(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(ZodError))
    })

    it('should return status 400, invalid email', async () => {
      const req = {
        body: {
          ...getNewUser(),
          email: 'invalid email'
        }
      } as unknown as AuthSignupRequest

      const res = buildRes()
      const next = buildNext()

      await authController.signup(req, res, next)

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
      } as unknown as AuthSignupRequest

      const res = buildRes()
      const next = buildNext()

      await authController.signup(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(MongooseError))
    })
  })

  describe('singin', () => {
    it('should signin a user', async () => {
      const mockUser = getNewUser()
      await UserModel.create(mockUser)

      const req = {
        user: {
          _id: getObjectId(),
          email: mockUser.email,
          name: mockUser.name
        }
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      authController.signin(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.cookie).toHaveBeenCalledWith('token', expect.any(String), {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      })

      const user = (res.json as jest.Mock).mock.calls[0][0] as User

      expect(user.name).toBe(mockUser.name)
      expect(user.email).toBe(mockUser.email)
      expect(user).not.toHaveProperty('password')

      expect(next).not.toHaveBeenCalled()
    })
  })
})