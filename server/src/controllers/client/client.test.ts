/* eslint-disable @typescript-eslint/unbound-method */
import clientController from '@/controllers/client'
import ClientModel from '@/model/client'
import userModel from '@/model/user'
import {
  buildNext,
  buildRes,
  getNewClient,
  getNewUser,
  getObjectId
} from '@/utils/generate'
import { parseUserSchema, type User } from '@/validation/user'
import { type Request } from 'express'
import { Error as MongooseError } from 'mongoose'
import { ZodError } from 'zod'

describe('Client Controller', () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let user: User = undefined!
  beforeEach(async () => {
    await ClientModel.deleteMany({})
  })
  beforeAll(async () => {
    user = parseUserSchema.parse(
      (await userModel.create(getNewUser())).toJSON()
    )
  })

  describe('Create', () => {
    it('should create a new client', async () => {
      const mockClient = getNewClient()

      const req = {
        body: mockClient,
        user
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await clientController.create(req, res, next)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(mockClient))
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with ZodError error, required name', async () => {
      const req = {
        body: {
          ...getNewClient(),
          name: undefined
        },
        user
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await clientController.create(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(ZodError))
    })

    it('should return status 400, invalid email', async () => {
      const req = {
        body: {
          ...getNewClient(),
          email: 'invalid email'
        },
        user
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await clientController.create(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(ZodError))
    })
  })

  describe('Find', () => {
    it('should find all clients', async () => {
      const mockClients = Array(2)
        .fill(null)
        .map(() => ({ ...getNewClient(), userId: user._id }))
      const expectedClient = await ClientModel.create(mockClients)
      const res = buildRes()
      const next = buildNext()
      const req = { user } as unknown as Request

      await clientController.find(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)

      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining(
          expectedClient.map((client) =>
            expect.objectContaining(client.toJSON())
          )
        )
      )

      expect(next).not.toHaveBeenCalled()
    })

    it('should find client by id', async () => {
      const mockClient = { ...getNewClient(), userId: user._id }

      const createdClient = await ClientModel.create(mockClient)

      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: createdClient._id.toString()
        },
        user
      } as unknown as Request

      await clientController.findById(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining(createdClient.toJSON())
      )
    })

    it('should return status 404, client not found', async () => {
      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: getObjectId()
        },
        user
      } as unknown as Request

      await clientController.findById(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        error: expect.any(String),
        message: expect.any(String)
      })
    })

    it('should call next with mongoose error, ivalid id', async () => {
      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: 'invalid id'
        },
        user
      } as unknown as Request

      await clientController.findById(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(MongooseError))
    })
  })

  describe('update', () => {
    it('should update client', async () => {
      const mockClient = { ...getNewClient(), userId: user._id }

      const { _id } = await ClientModel.create(mockClient)

      const res = buildRes()
      const next = buildNext()

      const updatedClient = getNewClient()
      const req = {
        params: {
          id: _id.toString()
        },
        body: updatedClient,
        user
      } as unknown as Request

      await clientController.update(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining(updatedClient)
      )
    })

    it('should return status 404, client not found', async () => {
      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: getObjectId()
        },
        body: getNewClient(),
        user
      } as unknown as Request

      await clientController.update(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        error: expect.any(String),
        message: expect.any(String)
      })
    })

    it('should call next with mongoose error, invalid id', async () => {
      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: 'invalid id'
        },
        body: getNewClient(),
        user
      } as unknown as Request

      await clientController.update(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(MongooseError))
    })

    it('should call next with ZodError error, invalid data', async () => {
      const req = {
        body: {
          name: undefined,
          email: 'invalid email',
          address: 'anything'
        },
        user
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await clientController.create(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(ZodError))
    })
  })

  describe('delete', () => {
    it('should delete client', async () => {
      const mockClient = { ...getNewClient(), userId: user._id }

      const { _id } = await ClientModel.create(mockClient)

      const res = buildRes()
      const next = buildNext()

      const req = {
        params: {
          id: _id.toString()
        },
        user
      } as unknown as Request

      await clientController.deleteById(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('should return status 404, client not found', async () => {
      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: getObjectId()
        },
        user
      } as unknown as Request

      await clientController.deleteById(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        error: expect.any(String),
        message: expect.any(String)
      })
    })

    it('should call next with mongoose error, invalid id', async () => {
      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: 'invalid id'
        },
        user
      } as unknown as Request

      await clientController.deleteById(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(MongooseError))
    })
  })
})
