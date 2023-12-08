/* eslint-disable @typescript-eslint/unbound-method */
import UserModel, { type UserType } from '@/model/user'
import userController, { type CreateUserRequest, type UserFindByIdType } from '@/controllers/user'
import { ZodError } from 'zod'
import { Error as MongooseError } from 'mongoose'
import { buildNext, buildRes, getNewUser } from '@/utils/generate'
import bcrypt from 'bcrypt'

describe('User Controller', () => {
  beforeEach(async () => {
    await UserModel.deleteMany()
  })

  describe('Create', () => {
    it('should create a new user', async () => {
      const mockUser = getNewUser()

      const req = {
        body: mockUser
      } as unknown as CreateUserRequest

      const res = buildRes()
      const next = buildNext()

      await userController.create(req, res, next)

      expect(res.status).toHaveBeenCalledWith(201)

      const jsonResponse = (res.json as jest.Mock).mock.calls[0][0] as UserType
      expect(jsonResponse.name).toBe(mockUser.name)
      expect(jsonResponse.email).toBe(mockUser.email)
      // test if user password is encrypted
      expect(bcrypt.compare(mockUser.password, jsonResponse.password)).toBeTruthy()

      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with ZodError error, required name', async () => {
      const req = {
        body: {
          ...getNewUser(),
          name: undefined
        }
      } as unknown as CreateUserRequest

      const res = buildRes()
      const next = buildNext()

      await userController.create(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(ZodError))
    }
    )

    it('should return status 400, invalid email', async () => {
      const req = {
        body: {
          ...getNewUser(),
          email: 'invalid email'
        }
      } as unknown as CreateUserRequest

      const res = buildRes()
      const next = buildNext()

      await userController.create(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(ZodError))
    }
    )

    it('should return status 400, email already exists', async () => {
      const mockUser = getNewUser()
      await UserModel.create(mockUser)

      const req = {
        body: {
          ...mockUser
        }
      } as unknown as CreateUserRequest

      const res = buildRes()
      const next = buildNext()

      await userController.create(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(MongooseError))
    }
    )
  })

  describe('Find', () => {
    it('should find all users', async () => {
      const mockUsers = Array(10).fill(null).map(getNewUser)
      const expectedUsers = await UserModel.create(mockUsers)

      const req = {} as unknown as UserFindByIdType
      const res = buildRes()
      const next = buildNext()

      await userController.find(req, res, next)
      expect(res.status).toHaveBeenCalledWith(200)

      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining(
          expectedUsers.map((user) => expect.objectContaining(user.toJSON()))
        )
      )

      expect(next).not.toHaveBeenCalled()
    }
    )
  })
}
)
