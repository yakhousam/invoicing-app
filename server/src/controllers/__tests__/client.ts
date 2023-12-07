/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { faker } from '@faker-js/faker'
import ClientModel, { type ClientType } from '@/model/client'
import ClientController, { type ClientUpdateType, type ClientFindByIdType, type CreateClientRequest } from '@/controllers/client'
import { type Response } from 'express'

const getName = (): string => faker.person.fullName()
const getEmail = (): string => faker.internet.email()
const getAdress = (): string => faker.location.streetAddress()

function buildRes (overrides = {}): Response {
  const res = {
    json: jest.fn(() => res).mockName('json'),
    status: jest.fn(() => res).mockName('status'),
    sendStatus: jest.fn(() => res).mockName('sendStatus'),
    ...overrides
  } as unknown as Response
  return res
}

const getNewClient = (): ClientType => ({
  name: getName(),
  email: getEmail(),
  address: getAdress()
})

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

      await ClientController.create(req, res)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(mockClient))
    })

    it('should return status 400, required name', async () => {
      const req = {
        body: {
          name: undefined,
          email: getEmail(),
          address: getAdress()
        }
      } as unknown as CreateClientRequest

      const res = buildRes()
      await ClientController.create(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        errors: expect.objectContaining({
          name: expect.anything()
        }),
        message: expect.any(String)
      })
    }
    )

    it('should return status 400, invalid email', async () => {
      const req = {
        body: {
          name: getName(),
          email: 'invalid email',
          address: getAdress()
        }
      } as CreateClientRequest

      const res = buildRes()
      await ClientController.create(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        errors: expect.objectContaining({
          email: expect.anything()
        }),
        message: expect.any(String)
      })
    }
    )
  })

  describe('Find', () => {
    it('should find all clients', async () => {
      const mockClients = Array(10).fill(null).map(() => (getNewClient()))

      await ClientModel.create(mockClients)

      const res = buildRes()

      await ClientController.find(null, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining(mockClients[0])]))
      expect((res.json as jest.Mock).mock.calls[0][0]).toHaveLength(mockClients.length)
    }
    )

    it('should find client by id', async () => {
      const mockClient = getNewClient()

      const { _id } = await ClientModel.create(mockClient)

      const res = buildRes()
      const req = {
        params: {
          id: _id.toString()
        }
      } as unknown as ClientFindByIdType

      await ClientController.findById(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(mockClient))
    }
    )

    it('should return status 404, client not found', async () => {
      const res = buildRes()
      const req = {
        params: {
          id: faker.database.mongodbObjectId()
        }
      } as unknown as ClientFindByIdType

      await ClientController.findById(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        error: expect.any(String),
        message: expect.any(String)
      })
    }
    )

    it('should return status 400, ivalid id', async () => {
      const res = buildRes()
      const req = {
        params: {
          id: 'invalid id'
        }
      } as unknown as ClientFindByIdType

      await ClientController.findById(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: expect.any(String),
        message: expect.any(String)
      })
    }
    )
  })

  describe('update', () => {
    it('should update client', async () => {
      const mockClient = getNewClient()

      const { _id } = await ClientModel.create(mockClient)

      const res = buildRes()

      const updatedClient = getNewClient()
      const req = {
        params: {
          id: _id.toString()
        },
        body: updatedClient

      } as unknown as ClientUpdateType

      await ClientController.update(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(updatedClient))
    })
    it('should return status 404, client not found', async () => {
      const res = buildRes()
      const req = {
        params: {
          id: faker.database.mongodbObjectId()
        },
        body: getNewClient()
      } as unknown as ClientUpdateType

      await ClientController.update(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        error: expect.any(String),
        message: expect.any(String)
      })
    }
    )

    it('should return status 400, invalid id', async () => {
      const res = buildRes()
      const req = {
        params: {
          id: 'invalid id'
        },
        body: getNewClient()
      } as unknown as ClientUpdateType

      await ClientController.update(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: expect.any(String),
        message: expect.any(String)
      })
    }
    )

    it('should return status 400, invalid data', async () => {
      const req = {
        body: {
          name: undefined,
          email: 'invalid email',
          address: getAdress()
        }
      } as unknown as CreateClientRequest

      const res = buildRes()
      await ClientController.create(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        errors: expect.anything(),
        message: expect.any(String)
      })
    }
    )
  })

  describe('delete', () => {
    it('should delete client', async () => {
      const mockClient = getNewClient()

      const { _id } = await ClientModel.create(mockClient)

      const res = buildRes()

      const req = {
        params: {
          id: _id.toString()
        }
      } as unknown as ClientFindByIdType

      await ClientController.delete(req, res)

      expect(res.status).toHaveBeenCalledWith(204)
    })

    it('should return status 404, client not found', async () => {
      const res = buildRes()
      const req = {
        params: {
          id: faker.database.mongodbObjectId()
        }
      } as unknown as ClientFindByIdType

      await ClientController.delete(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        error: expect.any(String),
        message: expect.any(String)
      })
    }
    )

    it('should return status 400, invalid id', async () => {
      const res = buildRes()
      const req = {
        params: {
          id: 'invalid id'
        }
      } as unknown as ClientFindByIdType

      await ClientController.delete(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: expect.any(String),
        message: expect.any(String)
      })
    }
    )
  }
  )
})
