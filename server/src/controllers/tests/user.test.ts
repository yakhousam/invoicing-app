/* eslint-disable @typescript-eslint/unbound-method */
import UserModel, { type UserType } from '@/model/user'
import userController, { type UserUpdateType, type CreateUserRequest, type UserFindByIdType } from '@/controllers/user'
import { ZodError } from 'zod'
import { Error as MongooseError } from 'mongoose'
import { buildNext, buildRes, getNewUser, getObjectId } from '@/utils/generate'
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
          expectedUsers.map(user => {
            const { password, ...userWithoutPassword } = user.toJSON()
            return expect.objectContaining(userWithoutPassword)
          })
        )
      )

      expect(next).not.toHaveBeenCalled()
    }
    )

    it('should find user by id', async () => {
      const mockUser = getNewUser()

      const expectedUser = await UserModel.create(mockUser)

      const req = {
        params: {
          id: expectedUser._id
        }
      } as unknown as UserFindByIdType

      const res = buildRes()
      const next = buildNext()

      await userController.findById(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)

      const { password, ...expectedUserWithoutPassword } = expectedUser.toJSON()
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining(expectedUserWithoutPassword)
      )

      expect(next).not.toHaveBeenCalled()
    }
    )

    it('should return status 404, user not found', async () => {
      const req = {
        params: {
          id: getObjectId()
        }
      } as unknown as UserFindByIdType

      const res = buildRes()
      const next = buildNext()

      await userController.findById(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
          message: expect.any(String)
        })
      )
    }
    )

    it('should call next with mongoose error, ivalid id', async () => {
      const req = {
        params: {
          id: 'invalid id'
        }
      } as unknown as UserFindByIdType

      const res = buildRes()
      const next = buildNext()

      await userController.findById(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(MongooseError))
    }
    )
  })

  describe.skip('Update', () => {
    it('should update user', async () => {
      const mockUser = getNewUser()

      const { _id } = await UserModel.create(mockUser)

      const req = {
        params: {
          id: _id
        },
        body: {
          ...mockUser,
          name: 'new name'
        }
      } as unknown as UserUpdateType

      const res = buildRes()
      const next = buildNext()

      await userController.update(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining(
          expect.objectContaining({
            ...mockUser,
            name: 'new name'
          })
        )
      )

      expect(next).not.toHaveBeenCalled()
    }
    )

    it('should return status 404, user not found', async () => {
      const req = {
        params: {
          id: 'invalid id'
        }
      } as unknown as UserUpdateType

      const res = buildRes()
      const next = buildNext()

      await userController.update(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(MongooseError))
    }
    )

    it('should call next with mongoose error, ivalid id', async () => {
      const req = {
        params: {
          id: 'invalid id'
        }
      } as unknown as UserUpdateType

      const res = buildRes()
      const next = buildNext()

      await userController.update(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(MongooseError))
    }
    )
  })

  describe('Delete', () => {
    it('should delete user', async () => {
      const mockUser = getNewUser()

      const expectedUser = await UserModel.create(mockUser)

      const req = {
        params: {
          id: expectedUser._id
        }
      } as unknown as UserFindByIdType

      const res = buildRes()
      const next = buildNext()

      await userController.deleteById(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)

      const { password, ...expectedUserWithoutPassword } = expectedUser.toJSON()
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining(expectedUserWithoutPassword)
      )

      expect(next).not.toHaveBeenCalled()
    }
    )

    it('should return status 404, user not found', async () => {
      const req = {
        params: {
          id: getObjectId()
        }
      } as unknown as UserFindByIdType

      const res = buildRes()
      const next = buildNext()

      await userController.deleteById(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
          message: expect.any(String)
        })
      )
    }
    )

    it('should call next with mongoose error, ivalid id', async () => {
      const req = {
        params: {
          id: 'invalid id'
        }
      } as unknown as UserFindByIdType

      const res = buildRes()
      const next = buildNext()

      await userController.deleteById(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(MongooseError))
    }
    )
  }
  )
}
)
