/* eslint-disable @typescript-eslint/unbound-method */
import ClientModel from '@/model/client'
import clientController, {
  type ClientUpdateType,
  type ClientFindByIdType,
  type CreateClientRequest
} from '@/controllers/client'
import { ZodError } from 'zod'
import { Error as MongooseError } from 'mongoose'
import {
  buildNext,
  buildRes,
  getNewClient,
  getObjectId
} from '@/utils/generate'

describe('Client Controller', () => {
  beforeEach(async () => {
    await ClientModel.deleteMany()
  })

  describe('Create', () => {
    it('should create a new client', async () => {
      const mockClient = getNewClient()

      const req = {
        body: mockClient
      } as unknown as CreateClientRequest

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
        }
      } as unknown as CreateClientRequest

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
        }
      } as unknown as CreateClientRequest

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
        .map(() => getNewClient())
      const expectedClient = await ClientModel.create(mockClients)
      const res = buildRes()
      const next = buildNext()

      await clientController.find(null, res, next)

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
      const mockClient = getNewClient()

      const { _id } = await ClientModel.create(mockClient)

      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: _id.toString()
        }
      } as unknown as ClientFindByIdType

      await clientController.findById(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(mockClient))
    })

    it('should return status 404, client not found', async () => {
      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: getObjectId()
        }
      } as unknown as ClientFindByIdType

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
        }
      } as unknown as ClientFindByIdType

      await clientController.findById(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(MongooseError))
    })
  })

  describe('update', () => {
    it('should update client', async () => {
      const mockClient = getNewClient()

      const { _id } = await ClientModel.create(mockClient)

      const res = buildRes()
      const next = buildNext()

      const updatedClient = getNewClient()
      const req = {
        params: {
          id: _id.toString()
        },
        body: updatedClient
      } as unknown as ClientUpdateType

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
        body: getNewClient()
      } as unknown as ClientUpdateType

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
        body: getNewClient()
      } as unknown as ClientUpdateType

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
        }
      } as unknown as CreateClientRequest

      const res = buildRes()
      const next = buildNext()

      await clientController.create(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(ZodError))
    })
  })

  describe('delete', () => {
    it('should delete client', async () => {
      const mockClient = getNewClient()

      const { _id } = await ClientModel.create(mockClient)

      const res = buildRes()
      const next = buildNext()

      const req = {
        params: {
          id: _id.toString()
        }
      } as unknown as ClientFindByIdType

      await clientController.deleteById(req, res, next)

      expect(res.status).toHaveBeenCalledWith(204)
    })

    it('should return status 404, client not found', async () => {
      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: getObjectId()
        }
      } as unknown as ClientFindByIdType

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
        }
      } as unknown as ClientFindByIdType

      await clientController.deleteById(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(MongooseError))
    })
  })
})
