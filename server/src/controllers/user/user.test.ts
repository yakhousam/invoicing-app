/* eslint-disable @typescript-eslint/unbound-method */
import userController from '@/controllers/user'
import ClientModel from '@/model/client'
import InvoiceModel from '@/model/invoice'
import UserModel from '@/model/user'
import {
  buildNext,
  buildRes,
  getCurrency,
  getNewClient,
  getNewUser,
  getObjectId,
  getProductName,
  getProductPrice
} from '@/utils/generate'
import { type CreateInvoice, type Invoice } from '@/validation/invoice'
import { type Request } from 'express'
import { Error as MongooseError } from 'mongoose'

describe('User Controller', () => {
  beforeEach(async () => {
    await UserModel.deleteMany()
  })

  describe('Find', () => {
    it('should find all users', async () => {
      const mockUsers = Array(10).fill(null).map(getNewUser)
      const expectedUsers = await UserModel.create(mockUsers)

      const req = {} as unknown as Request
      const res = buildRes()
      const next = buildNext()

      await userController.findAll(req, res, next)
      expect(res.status).toHaveBeenCalledWith(200)

      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining(
          expectedUsers.map((user) => {
            const { password, ...userWithoutPassword } = user.toJSON()
            return expect.objectContaining(userWithoutPassword)
          })
        )
      )

      expect(next).not.toHaveBeenCalled()
    })

    it('should find user by id', async () => {
      const mockUser = getNewUser()

      const expectedUser = await UserModel.create(mockUser)

      const req = {
        params: {
          id: expectedUser._id
        }
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await userController.findOne(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)

      const { password, ...expectedUserWithoutPassword } = expectedUser.toJSON()
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining(expectedUserWithoutPassword)
      )

      expect(next).not.toHaveBeenCalled()
    })

    it('should return status 404, user not found', async () => {
      const req = {
        params: {
          id: getObjectId()
        }
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await userController.findOne(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
          message: expect.any(String)
        })
      )
    })

    it('should call next with mongoose error, ivalid id', async () => {
      const req = {
        params: {
          id: 'invalid id'
        }
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await userController.findOne(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(MongooseError))
    })

    it('should find invoices by user id', async () => {
      const expectedUser = await UserModel.create(getNewUser())
      const expectedClient = await ClientModel.create(
        getNewClient(expectedUser._id)
      )

      const notExpectedUser = await UserModel.create(getNewUser())

      const notExpectedUserInvoices: CreateInvoice[] = Array(10)
        .fill(null)
        .map(() => ({
          user: notExpectedUser._id.toString(),
          client: { _id: expectedClient._id.toString() },
          currency: getCurrency(),
          items: Array(10)
            .fill(null)
            .map(() => ({
              itemName: getProductName(),
              itemPrice: getProductPrice()
            }))
        }))

      await InvoiceModel.create(notExpectedUserInvoices)

      const expectedUserInvoices: CreateInvoice[] = Array(10)
        .fill(null)
        .map(() => ({
          user: expectedUser._id.toString(),
          client: { _id: expectedClient._id.toString() },
          currency: getCurrency(),
          items: Array(10)
            .fill(null)
            .map(() => ({
              itemName: getProductName(),
              itemPrice: getProductPrice()
            }))
        }))

      const expectedInvoices = await InvoiceModel.create(expectedUserInvoices)

      const req = {
        params: {
          id: expectedUser._id.toString()
        }
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await userController.findUserInvoices(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)

      const jsonResponse = (res.json as jest.Mock).mock.calls[0][0] as Array<
        Invoice & { _id: string }
      >
      expect(jsonResponse.length).toBe(expectedInvoices.length)
      jsonResponse.forEach((invoice) => {
        expect(invoice.user._id.toString()).toBe(expectedUser._id.toString())
      })
      expect(next).not.toHaveBeenCalled()
    })
  })

  // describe.skip('Update', () => {
  //   it('should update user', async () => {
  //     const mockUser = getNewUser()

  //     const { _id } = await UserModel.create(mockUser)

  //     const req = {
  //       params: {
  //         id: _id
  //       },
  //       body: {
  //         ...mockUser,
  //         name: 'new name'
  //       }
  //     } as unknown as UserUpdateType

  //     const res = buildRes()
  //     const next = buildNext()

  //     await userController.update(req, res, next)

  //     expect(res.status).toHaveBeenCalledWith(200)

  //     expect(res.json).toHaveBeenCalledWith(
  //       expect.objectContaining(
  //         expect.objectContaining({
  //           ...mockUser,
  //           name: 'new name'
  //         })
  //       )
  //     )

  //     expect(next).not.toHaveBeenCalled()
  //   }
  //   )

  //   it('should return status 404, user not found', async () => {
  //     const req = {
  //       params: {
  //         id: 'invalid id'
  //       }
  //     } as unknown as UserUpdateType

  //     const res = buildRes()
  //     const next = buildNext()

  //     await userController.update(req, res, next)

  //     expect(next).toHaveBeenCalledTimes(1)
  //     expect(next).toHaveBeenCalledWith(expect.any(MongooseError))
  //   }
  //   )

  //   it('should call next with mongoose error, invalid id', async () => {
  //     const req = {
  //       params: {
  //         id: 'invalid id'
  //       }
  //     } as unknown as UserUpdateType

  //     const res = buildRes()
  //     const next = buildNext()

  //     await userController.update(req, res, next)

  //     expect(next).toHaveBeenCalledTimes(1)
  //     expect(next).toHaveBeenCalledWith(expect.any(MongooseError))
  //   }
  //   )
  // })

  describe('Delete', () => {
    it('should delete user', async () => {
      const mockUser = getNewUser()

      const expectedUser = await UserModel.create(mockUser)

      const req = {
        params: {
          id: expectedUser._id
        }
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await userController.deleteUserAccount(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)

      const { password, ...expectedUserWithoutPassword } = expectedUser.toJSON()
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining(expectedUserWithoutPassword)
      )

      expect(next).not.toHaveBeenCalled()
    })

    it('should return status 404, user not found', async () => {
      const req = {
        params: {
          id: getObjectId()
        }
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await userController.deleteUserAccount(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
          message: expect.any(String)
        })
      )
    })

    it('should call next with mongoose error, invalid id', async () => {
      const req = {
        params: {
          id: 'invalid id'
        }
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await userController.deleteUserAccount(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(MongooseError))
    })
  })
})
