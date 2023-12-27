/* eslint-disable @typescript-eslint/unbound-method */
import invoiceController, {
  type CreateInvoiceRequest,
  type FindAllIvoicesRequest,
  type findInvoiceByIdRequest
} from '@/controllers/invoice'
import ClientModel, { type Client } from '@/model/client'
import InvoiceModel, { type Invoice } from '@/model/invoice'
import UserModel, { type User } from '@/model/user'
import {
  buildNext,
  buildRes,
  getNewClient,
  getNewUser,
  getObjectId,
  getProductName,
  getProductPrice
} from '@/utils/generate'
import { type Request } from 'express'
import { Error as MongooseError } from 'mongoose'
import { ZodError } from 'zod'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function createMockInvoices(user: User, client: Client) {
  const mockInvoices: Array<CreateInvoiceRequest['body']> = Array(10)
    .fill(null)
    .map(() => ({
      user: user._id.toString(),
      client: client._id.toString(),
      items: Array(10)
        .fill(null)
        .map(() => ({
          itemName: getProductName(),
          itemPrice: getProductPrice()
        }))
    }))
  return await InvoiceModel.create(mockInvoices)
}

describe('Invoice Controller', () => {
  beforeEach(async () => {
    await InvoiceModel.deleteMany({})
  })

  describe('Create', () => {
    it('should create a new invoice', async () => {
      const client = await ClientModel.create(getNewClient())
      const user = await UserModel.create(getNewUser())

      const mockInvoice: CreateInvoiceRequest['body'] = {
        client: client._id.toString(),
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
      } as unknown as CreateInvoiceRequest

      const res = buildRes()
      const next = buildNext()

      await invoiceController.create(req, res, next)
      expect(res.status).toHaveBeenCalledWith(201)

      const jsonResponse = (res.json as jest.Mock).mock.calls[0][0] as Invoice

      expect(jsonResponse.client.toString()).toBe(mockInvoice.client)
      expect(jsonResponse.user.toString()).toBe(user._id.toString())
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
      expect(jsonResponse.dueDate).toBeDefined()
      expect(jsonResponse.paid).toBe(false)

      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with ZodError error, invalid data', async () => {
      const user = { ...getNewUser(), _id: '123456' }
      const mockInvoice: CreateInvoiceRequest['body'] = {
        client: '12456456',
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
      } as unknown as CreateInvoiceRequest

      const res = buildRes()
      const next = buildNext()

      await invoiceController.create(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(ZodError))
    })

    it('should call next with ZodError error, missing required fields', async () => {
      const user = { ...getNewUser(), _id: getObjectId() }
      const mockInvoice: Partial<CreateInvoiceRequest['body']> = {
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
      } as unknown as CreateInvoiceRequest

      const res = buildRes()
      const next = buildNext()

      await invoiceController.create(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(ZodError))
    })

    it('should call next with mongoose error, userId of clientId not found', async () => {
      const user = { ...getNewUser(), _id: getObjectId() }
      const mockInvoice: CreateInvoiceRequest['body'] = {
        client: getObjectId(),

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
      } as unknown as CreateInvoiceRequest

      const res = buildRes()
      const next = buildNext()

      await invoiceController.create(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(MongooseError))
    })

    it('should increment invoiceNo', async () => {
      const client = await ClientModel.create(getNewClient())
      const user = await UserModel.create(getNewUser())

      const mockInvoice: CreateInvoiceRequest['body'] = {
        client: client._id.toString(),
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
      } as unknown as CreateInvoiceRequest

      const res = buildRes()
      const next = buildNext()

      await invoiceController.create(req, res, next)
      expect(res.status).toHaveBeenCalledWith(201)

      const jsonResponse = (res.json as jest.Mock).mock.calls[0][0] as Invoice
      expect(jsonResponse.invoiceNo).toBe(1)

      await invoiceController.create(req, res, next)
      expect(res.status).toHaveBeenCalledWith(201)

      const jsonResponse2 = (res.json as jest.Mock).mock.calls[1][0] as Invoice
      expect(jsonResponse2.invoiceNo).toBe(2)
    })

    it('should start invoiceNo from 1, new year', async () => {
      const client = await ClientModel.create(getNewClient())
      const user = await UserModel.create(getNewUser())

      const mockInvoice: CreateInvoiceRequest['body'] = {
        client: client._id.toString(),
        invoiceDate: new Date('2021-12-31').toISOString(),
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
      } as unknown as CreateInvoiceRequest

      const res = buildRes()
      const next = buildNext()

      await invoiceController.create(req, res, next)
      expect(res.status).toHaveBeenCalledWith(201)

      const jsonResponse = (res.json as jest.Mock).mock.calls[0][0] as Invoice
      expect(jsonResponse.invoiceNo).toBe(1)

      await InvoiceModel.deleteMany()

      await invoiceController.create(req, res, next)
      expect(res.status).toHaveBeenCalledWith(201)

      const jsonResponse2 = (res.json as jest.Mock).mock.calls[1][0] as Invoice
      expect(jsonResponse2.invoiceNo).toBe(1)
    })
  })

  describe('Find', () => {
    it('should find all user invoices', async () => {
      const client = await ClientModel.create(getNewClient())
      const user1 = await UserModel.create(getNewUser())
      const user2 = await UserModel.create(getNewUser())

      const expectedInvoices = await createMockInvoices(user1, client)
      await createMockInvoices(user2, client)

      const req = { user: user1 } as unknown as FindAllIvoicesRequest

      const res = buildRes()
      const next = buildNext()

      await invoiceController.find(req, res, next)
      expect(res.status).toHaveBeenCalledWith(200)
      const jsonResponse = (res.json as jest.Mock).mock.calls[0][0] as Invoice[]
      expect(jsonResponse.length).toBe(expectedInvoices.length)
      // all returned invoices should belong to the user
      jsonResponse.forEach((invoice) => {
        expect(invoice.user.toString()).toBe(user1._id.toString())
      })
    })

    it('should find invoice by id', async () => {
      const client = await ClientModel.create(getNewClient())
      const user = await UserModel.create(getNewUser())

      const mockInvoice: CreateInvoiceRequest['body'] = {
        client: client._id.toString(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const expectedInvoice = await InvoiceModel.create({
        ...mockInvoice,
        user: user._id.toString()
      })

      const req = {
        params: {
          id: expectedInvoice._id.toString()
        },
        user
      } as unknown as findInvoiceByIdRequest

      const res = buildRes()
      const next = buildNext()

      await invoiceController.findById(req, res, next)
      expect(res.status).toHaveBeenCalledWith(200)
      const jsonResponse = (res.json as jest.Mock).mock
        .calls[0][0] as Invoice & { _id: string }
      expect(jsonResponse._id.toString()).toBe(expectedInvoice._id.toString())
    })

    it('should call next with error, invalid invoice id', async () => {
      const user = await UserModel.create(getNewUser())

      const req = {
        params: {
          id: 'invalid-id' // Invalid invoice id
        },
        user
      } as unknown as findInvoiceByIdRequest

      const res = buildRes()
      const next = buildNext()

      await invoiceController.findById(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(MongooseError))
    })

    it('should call res with status 404, invoice not found', async () => {
      const client = await ClientModel.create(getNewClient())
      const user1 = await UserModel.create(getNewUser())
      const user2 = await UserModel.create(getNewUser())

      const mockInvoice: CreateInvoiceRequest['body'] = {
        client: client._id.toString(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const invoice = await InvoiceModel.create({
        ...mockInvoice,
        user: user1._id.toString()
      })

      const req = {
        params: {
          id: invoice._id.toString()
        },
        user: user2
      } as unknown as findInvoiceByIdRequest

      const res = buildRes()
      const next = buildNext()

      await invoiceController.findById(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
    })
  })
  describe('Update', () => {
    it('should mark the invoice as paid', async () => {
      const client = await ClientModel.create(getNewClient())
      const user = await UserModel.create(getNewUser())
      const mockInvoice: CreateInvoiceRequest['body'] = {
        client: client._id.toString(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const invoice = await InvoiceModel.create({
        ...mockInvoice,
        user: user._id.toString()
      })
      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: invoice._id.toString()
        },
        body: {
          paid: true
        },
        user
      } as unknown as Request

      await invoiceController.updateById(req, res, next)
      expect(res.status).toHaveBeenCalledWith(200)
      const jsonResponse = (res.json as jest.Mock).mock.calls[0][0] as Invoice
      expect(jsonResponse.paid).toBe(true)
    })

    it('should not allow to mark the invoice unpaid once it was paid', async () => {
      const client = await ClientModel.create(getNewClient())
      const user = await UserModel.create(getNewUser())
      const mockInvoice = {
        paid: true,
        client: client._id.toString(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const invoice = await InvoiceModel.create({
        ...mockInvoice,
        user: user._id.toString()
      })
      const res = buildRes()
      const next = buildNext()
      const req = {
        params: {
          id: invoice._id.toString()
        },
        body: {
          paid: false
        },
        user
      } as unknown as Request

      await invoiceController.updateById(req, res, next)
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(ZodError))
    })
  })
})
