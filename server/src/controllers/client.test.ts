/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { faker } from '@faker-js/faker'
import { type ClientType } from '../model/client'
import ClientController, { type CreateClientRequest } from './client'
import { type Response } from 'express'
import ClientModel from '../model/client'

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
    it.only('should return status 200, find all clients', async () => {
      const mockClients: ClientType[] = Array(10).fill(null).map(() => (getNewClient()))

      ClientModel.find = jest.fn().mockResolvedValueOnce(mockClients)

      const res = buildRes()

      await ClientController.find(null, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockClients)
    }
    )
  })
})
