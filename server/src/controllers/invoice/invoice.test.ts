/* eslint-disable @typescript-eslint/unbound-method */
import invoiceController from '@/controllers/invoice'
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
import {
  invoiceArraySchema,
  invoiceSchema,
  type CreateInvoice
} from '@/validation'
import { clientSchema } from '@/validation/client'
import { parseUserSchema } from '@/validation/user'
import { type Request } from 'express'
import { Error as MongooseError } from 'mongoose'
import { ZodError } from 'zod'

describe('Invoice Controller', () => {
  beforeEach(async () => {
    await InvoiceModel.deleteMany({})
  })

  describe('Create', () => {
    it('should create a new invoice', async () => {
      const user = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )
      const client = clientSchema.parse(
        (await ClientModel.create(getNewClient(user._id))).toJSON()
      )

      const mockInvoice: CreateInvoice = {
        client: { _id: client._id },
        currency: getCurrency(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const req = {
        body: mockInvoice,
        user
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await invoiceController.create(req, res, next)
      expect(res.status).toHaveBeenCalledWith(201)

      const jsonResponse = invoiceSchema.parse(
        (res.json as jest.Mock).mock.calls[0][0]
      )
      expect(jsonResponse.client._id).toBe(mockInvoice.client._id)
      expect(jsonResponse.user._id).toBe(user._id)
      expect(jsonResponse.items.length).toBe(mockInvoice.items.length)
      expect(jsonResponse.items).toEqual(
        expect.arrayContaining(
          mockInvoice.items.map((item) => expect.objectContaining(item))
        )
      )
      expect(jsonResponse.totalAmount).toBe(
        mockInvoice.items.reduce((acc, item) => acc + item.itemPrice, 0)
      )
      expect(jsonResponse.invoiceNo).toBe(1)
      expect(jsonResponse.invoiceDate).toBeDefined()
      expect(jsonResponse.invoiceDueDays).toBeDefined()
      expect(jsonResponse.paid).toBe(false)
      expect(jsonResponse.status).toBe('sent')

      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with ZodError error, invalid data', async () => {
      const user = { ...getNewUser(), _id: getObjectId() }
      const mockInvoice: CreateInvoice = {
        client: { _id: '12456456' },
        currency: getCurrency(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }
      const req = {
        body: mockInvoice,
        user
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await invoiceController.create(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(ZodError))
    })

    it('should call next with ZodError error, missing required fields', async () => {
      const user = { ...getNewUser(), _id: getObjectId() }
      const mockInvoice: Partial<CreateInvoice> = {
        // client field is missing
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }
      const req = {
        body: mockInvoice,
        user
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await invoiceController.create(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(ZodError))
    })

    it('should call next with mongoose error, userId of clientId not found', async () => {
      const user = {
        ...getNewUser(),
        _id: getObjectId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      const mockInvoice: CreateInvoice = {
        client: { _id: getObjectId() },
        currency: getCurrency(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }
      const req = {
        body: mockInvoice,
        user
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await invoiceController.create(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(MongooseError))
    })

    it('should increment invoiceNo', async () => {
      const user = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )
      const client = clientSchema.parse(
        await ClientModel.create(getNewClient(user._id))
      )

      const mockInvoice: CreateInvoice = {
        client: { _id: client._id },
        currency: getCurrency(),
        items: Array(1)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const req = {
        body: mockInvoice,
        user
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await invoiceController.create(req, res, next)
      expect(res.status).toHaveBeenCalledWith(201)

      const jsonResponse = invoiceSchema.parse(
        (res.json as jest.Mock).mock.calls[0][0]
      )
      expect(jsonResponse.invoiceNo).toBe(1)

      await invoiceController.create(req, res, next)
      expect(res.status).toHaveBeenCalledWith(201)

      const jsonResponse2 = invoiceSchema.parse(
        (res.json as jest.Mock).mock.calls[1][0]
      )
      expect(jsonResponse2.invoiceNo).toBe(2)
    })

    it('should start invoiceNo from 1, new year', async () => {
      const user = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )
      const client = clientSchema.parse(
        await ClientModel.create(getNewClient(user._id))
      )

      const mockInvoice: CreateInvoice = {
        client: { _id: client._id },
        invoiceDate: new Date('2021-12-31').toISOString(),
        currency: getCurrency(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const req = {
        body: mockInvoice,
        user
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await invoiceController.create(req, res, next)
      expect(res.status).toHaveBeenCalledWith(201)

      const jsonResponse = invoiceSchema.parse(
        (res.json as jest.Mock).mock.calls[0][0]
      )
      expect(jsonResponse.invoiceNo).toBe(1)

      await InvoiceModel.deleteMany()

      await invoiceController.create(req, res, next)
      expect(res.status).toHaveBeenCalledWith(201)

      const jsonResponse2 = invoiceSchema.parse(
        (res.json as jest.Mock).mock.calls[1][0]
      )
      expect(jsonResponse2.invoiceNo).toBe(1)
    })
  })

  describe('Find', () => {
    it('should find all user invoices', async () => {
      const user1 = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )
      const user2 = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )

      const client1 = clientSchema.parse(
        (await ClientModel.create(getNewClient(user1._id))).toJSON()
      )
      const client2 = clientSchema.parse(
        (await ClientModel.create(getNewClient(user2._id))).toJSON()
      )

      // Inject 10 invoices for user1 and 10 invoices for user2 to the database
      const expectedInvoices = await InvoiceModel.create(
        Array(10)
          .fill(null)
          .map(() => ({
            user: user1._id,
            client: { _id: client1._id },
            items: Array(10)
              .fill(null)
              .map(() => ({
                itemName: getProductName(),
                itemPrice: getProductPrice()
              }))
          }))
      )
      await InvoiceModel.create(
        Array(10)
          .fill(null)
          .map(() => ({
            user: user2._id,
            client: { _id: client2._id },
            items: Array(10)
              .fill(null)
              .map(() => ({
                itemName: getProductName(),
                itemPrice: getProductPrice()
              }))
          }))
      )

      const req = { user: user1 } as unknown as Request
      const res = buildRes()
      const next = buildNext()

      await invoiceController.findAll(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)

      const jsonResponse = invoiceArraySchema.parse(
        (res.json as jest.Mock).mock.calls[0][0]
      )
      expect(jsonResponse.length).toBe(expectedInvoices.length)
      // all returned invoices should belong to the user
      jsonResponse.forEach((invoice) => {
        expect(invoice.user).toBe(user1._id)
      })
    })

    it('should find invoice by id', async () => {
      const user = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )

      const client = clientSchema.parse(
        (await ClientModel.create(getNewClient(user._id))).toJSON()
      )
      const mockInvoice: CreateInvoice = {
        client: { _id: client._id },
        currency: getCurrency(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const expectedInvoice = await InvoiceModel.create({
        ...mockInvoice,
        user: user._id
      })

      const req = {
        params: {
          id: expectedInvoice._id
        },
        user
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await invoiceController.findOne(req, res, next)
      expect(res.status).toHaveBeenCalledWith(200)
      const jsonResponse = invoiceSchema.parse(
        (res.json as jest.Mock).mock.calls[0][0]
      )
      expect(jsonResponse._id).toBe(expectedInvoice._id.toString())
    })

    it('should call next with error, invalid invoice id', async () => {
      const user = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )

      const req = {
        params: {
          id: 'invalid-id' // Invalid invoice id
        },
        user
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await invoiceController.findOne(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(MongooseError))
    })

    it('should call res with status 404, invoice not found', async () => {
      const user1 = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )
      const client = clientSchema.parse(
        (await ClientModel.create(getNewClient(user1._id))).toJSON()
      )
      const user2 = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )

      const mockInvoice: CreateInvoice = {
        client: { _id: client._id },
        currency: getCurrency(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const invoice = await InvoiceModel.create({
        ...mockInvoice,
        user: user1._id
      })

      const req = {
        params: {
          id: invoice._id
        },
        user: user2
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await invoiceController.findOne(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
    })
  })
  describe('Invoice Status', () => {
    it('should return sent status', async () => {
      const user = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )
      const client = clientSchema.parse(
        (await ClientModel.create(getNewClient(user._id))).toJSON()
      )
      const mockInvoice: CreateInvoice = {
        client: { _id: client._id },
        currency: getCurrency(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          })),
        invoiceDate: new Date().toISOString(),
        invoiceDueDays: 7
      }

      const invoice = await InvoiceModel.create({
        ...mockInvoice,
        user: user._id
      })
      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: invoice._id
        },
        user
      } as unknown as Request

      await invoiceController.findOne(req, res, next)
      expect(res.status).toHaveBeenCalledWith(200)
      const jsonResponse = invoiceSchema.parse(
        (res.json as jest.Mock).mock.calls[0][0]
      )
      expect(jsonResponse.status).toBe('sent')
    })

    it('should return paid status', async () => {
      const user = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )
      const client = clientSchema.parse(
        (await ClientModel.create(getNewClient(user._id))).toJSON()
      )
      const mockInvoice: CreateInvoice = {
        client: { _id: client._id },
        currency: getCurrency(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          })),
        invoiceDate: new Date().toISOString(),
        invoiceDueDays: 7
      }

      const invoice = await InvoiceModel.create({
        ...mockInvoice,
        paid: true,
        user: user._id
      })
      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: invoice._id
        },
        user
      } as unknown as Request

      await invoiceController.findOne(req, res, next)
      expect(res.status).toHaveBeenCalledWith(200)
      const jsonResponse = invoiceSchema.parse(
        (res.json as jest.Mock).mock.calls[0][0]
      )
      expect(jsonResponse.status).toBe('paid')
    })

    it('should return overdue status', async () => {
      const user = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )
      const client = clientSchema.parse(
        (await ClientModel.create(getNewClient(user._id))).toJSON()
      )
      const mockInvoice: CreateInvoice = {
        client: { _id: client._id },
        currency: getCurrency(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          })),
        invoiceDate: new Date('2020-01-01').toISOString(),
        invoiceDueDays: 7
      }

      const invoice = await InvoiceModel.create({
        ...mockInvoice,
        user: user._id
      })
      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: invoice._id
        },
        user
      } as unknown as Request

      await invoiceController.findOne(req, res, next)
      expect(res.status).toHaveBeenCalledWith(200)
      const jsonResponse = invoiceSchema.parse(
        (res.json as jest.Mock).mock.calls[0][0]
      )
      expect(jsonResponse.status).toBe('overdue')
    })
  })
  describe('Update', () => {
    it('should mark the invoice as paid', async () => {
      const user = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )
      const client = clientSchema.parse(
        (await ClientModel.create(getNewClient(user._id))).toJSON()
      )
      const mockInvoice: CreateInvoice = {
        client: { _id: client._id },
        currency: getCurrency(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const invoice = await InvoiceModel.create({
        ...mockInvoice,
        user: user._id
      })
      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: invoice._id
        },
        body: {
          paid: true
        },
        user
      } as unknown as Request

      await invoiceController.updateOne(req, res, next)
      expect(res.status).toHaveBeenCalledWith(200)
      const jsonResponse = invoiceSchema.parse(
        (res.json as jest.Mock).mock.calls[0][0]
      )
      expect(jsonResponse.paid).toBe(true)
    })

    it('should not allow to mark the invoice unpaid once it was paid', async () => {
      const user = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )
      const client = clientSchema.parse(
        (await ClientModel.create(getNewClient(user._id))).toJSON()
      )
      const mockInvoice: CreateInvoice & { paid: true } = {
        paid: true,
        client: { _id: client._id },
        currency: getCurrency(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const invoice = await InvoiceModel.create({
        ...mockInvoice,
        user: user._id
      })
      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: invoice._id
        },
        body: {
          paid: false
        },
        user
      } as unknown as Request

      await invoiceController.updateOne(req, res, next)
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(ZodError))
    })

    it('should update invoice due days', async () => {
      const user = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )
      const client = clientSchema.parse(
        (await ClientModel.create(getNewClient(user._id))).toJSON()
      )
      const mockInvoice: CreateInvoice = {
        client: { _id: client._id },
        currency: getCurrency(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const invoice = await InvoiceModel.create({
        ...mockInvoice,
        user: user._id
      })
      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: invoice._id
        },
        body: {
          invoiceDueDays: 10
        },
        user
      } as unknown as Request

      await invoiceController.updateOne(req, res, next)
      expect(res.status).toHaveBeenCalledWith(200)
      const jsonResponse = invoiceSchema.parse(
        (res.json as jest.Mock).mock.calls[0][0]
      )
      expect(jsonResponse.invoiceDueDays).toBe(10)
    })

    it('should update invoice date', async () => {
      const user = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )
      const client = clientSchema.parse(
        (await ClientModel.create(getNewClient(user._id))).toJSON()
      )
      const mockInvoice: CreateInvoice = {
        client: { _id: client._id },
        currency: getCurrency(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const invoice = await InvoiceModel.create({
        ...mockInvoice,
        user: user._id
      })

      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: invoice._id
        },
        body: {
          invoiceDate: new Date('2020-01-01').toISOString()
        },
        user
      } as unknown as Request

      await invoiceController.updateOne(req, res, next)
      expect(res.status).toHaveBeenCalledWith(200)
      const jsonResponse = invoiceSchema.parse(
        (res.json as jest.Mock).mock.calls[0][0]
      )
      expect(jsonResponse.invoiceDate).toBe('2020-01-01T00:00:00.000Z')
    })

    it('should update invoice items', async () => {
      const user = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )
      const client = clientSchema.parse(
        (await ClientModel.create(getNewClient(user._id))).toJSON()
      )
      const mockInvoice: CreateInvoice = {
        client: { _id: client._id },
        currency: getCurrency(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const invoice = await InvoiceModel.create({
        ...mockInvoice,
        user: user._id
      })
      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: invoice._id
        },
        body: {
          items: [
            {
              itemName: 'test2',
              itemPrice: 20
            }
          ]
        },
        user
      } as unknown as Request

      await invoiceController.updateOne(req, res, next)
      expect(res.status).toHaveBeenCalledWith(200)
      const jsonResponse = invoiceSchema.parse(
        (res.json as jest.Mock).mock.calls[0][0]
      )
      expect(jsonResponse.items.length).toBe(1)
      expect(jsonResponse.items[0].itemName).toBe('test2')
      expect(jsonResponse.items[0].itemPrice).toBe(20)
    })

    it('should call next with error, invalid invoice id', async () => {
      const user = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )

      const req = {
        params: {
          id: 'invalid-id' // Invalid invoice id
        },
        body: {
          paid: true
        },
        user
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await invoiceController.updateOne(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(MongooseError))
    })

    it('should call res with status 404, invoice not found', async () => {
      const user1 = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )
      const client = clientSchema.parse(
        (await ClientModel.create(getNewClient(user1._id))).toJSON()
      )
      const user2 = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )

      const mockInvoice: CreateInvoice = {
        client: { _id: client._id },
        currency: getCurrency(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const invoice = await InvoiceModel.create({
        ...mockInvoice,
        user: user1._id
      })

      const req = {
        params: {
          id: invoice._id
        },
        body: {
          paid: true
        },
        user: user2
      } as unknown as Request

      const res = buildRes()
      const next = buildNext()

      await invoiceController.updateOne(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('should not update user and client fields', async () => {
      const user = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )
      const client = clientSchema.parse(
        (await ClientModel.create(getNewClient(user._id))).toJSON()
      )
      const mockInvoice: CreateInvoice & {
        user: string
      } = {
        client: { _id: client._id },
        currency: getCurrency(),
        user: user._id,
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const invoice = (await InvoiceModel.create(mockInvoice)).toJSON()

      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: invoice._id
        },
        body: {
          client: 'new client id',
          user: 'new user id'
        },
        user
      } as unknown as Request

      await invoiceController.updateOne(req, res, next)
      expect(res.status).toHaveBeenCalledWith(200)
      const jsonResponse = invoiceSchema.parse(
        (res.json as jest.Mock).mock.calls[0][0]
      )
      expect(jsonResponse.client._id).toBe(client._id)
      expect(jsonResponse.user._id).toBe(user._id)
    })
  })

  describe('Delete', () => {
    it('should delete invoice', async () => {
      const user = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )
      const client = clientSchema.parse(
        (await ClientModel.create(getNewClient(user._id))).toJSON()
      )
      const mockInvoice: CreateInvoice & {
        user: string
      } = {
        client: { _id: client._id },
        currency: getCurrency(),
        user: user._id,
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const invoice = (await InvoiceModel.create(mockInvoice)).toJSON()
      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: invoice._id
        },
        user
      } as unknown as Request

      await invoiceController.deleteOne(req, res, next)
      expect(res.sendStatus).toHaveBeenCalledWith(204)
    })

    it('should not delete paid invoice', async () => {
      const user = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )
      const client = clientSchema.parse(
        (await ClientModel.create(getNewClient(user._id))).toJSON()
      )
      const mockInvoice: CreateInvoice & {
        paid: true
        user: string
      } = {
        client: { _id: client._id },
        user: user._id,
        paid: true,
        currency: getCurrency(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const invoice = (await InvoiceModel.create(mockInvoice)).toJSON()
      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: invoice._id
        },
        user
      } as unknown as Request

      await invoiceController.deleteOne(req, res, next)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('should return status 404, invoice not found', async () => {
      const user = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )

      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: getObjectId()
        },
        user
      } as unknown as Request

      await invoiceController.deleteOne(req, res, next)
      expect(res.status).toHaveBeenCalledWith(404)
    })

    it('should not be able to delete other users invoices', async () => {
      const user1 = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )
      const client = clientSchema.parse(
        (await ClientModel.create(getNewClient(user1._id))).toJSON()
      )
      const user2 = parseUserSchema.parse(
        (await UserModel.create(getNewUser())).toJSON()
      )
      const mockInvoice: CreateInvoice & {
        user: string
      } = {
        client: { _id: client._id },
        user: user1._id,
        currency: getCurrency(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const invoice = (await InvoiceModel.create(mockInvoice)).toJSON()
      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: invoice._id
        },
        user: user2
      } as unknown as Request

      await invoiceController.deleteOne(req, res, next)
      expect(res.status).toHaveBeenCalledWith(404)
    })
  })
})
