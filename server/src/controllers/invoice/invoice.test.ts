/* eslint-disable @typescript-eslint/unbound-method */
import InvoiceModel, { type Invoice } from '@/model/invoice'
import invoiceController, {
  type findInvoiceByIdRequest,
  type CreateInvoiceRequest
} from '@/controllers/invoice'
import { ZodError } from 'zod'
import { Error as MongooseError } from 'mongoose'
import {
  buildNext,
  buildRes,
  getNewClient,
  getNewUser,
  getObjectId,
  getProductName,
  getProductPrice
} from '@/utils/generate'
import ClientModel from '@/model/client'
import UserModel from '@/model/user'

describe('Invoice Controller', () => {
  beforeEach(async () => {
    await InvoiceModel.deleteMany()
  })

  describe('Create', () => {
    it('should create a new invoice', async () => {
      const client = await ClientModel.create(getNewClient())
      const user = await UserModel.create(getNewUser())

      const mockInvoice: CreateInvoiceRequest['body'] = {
        client: client._id.toString(),
        user: user._id.toString(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const req = {
        body: mockInvoice
      } as unknown as CreateInvoiceRequest

      const res = buildRes()
      const next = buildNext()

      await invoiceController.create(req, res, next)
      expect(res.status).toHaveBeenCalledWith(201)

      const jsonResponse = (res.json as jest.Mock).mock.calls[0][0] as Invoice
      // expect(jsonResponse.clientId.toString()).toBe(mockInvoice.clientId)
      // expect(jsonResponse.userId.toString()).toBe(mockInvoice.userId)
      expect(jsonResponse.items.length).toBe(mockInvoice.items.length)
      expect(jsonResponse.items).toEqual(
        expect.arrayContaining(
          mockInvoice.items.map((item) => expect.objectContaining(item))
        )
      )
      expect(jsonResponse.totalAmount).toBe(
        mockInvoice.items.reduce((acc, item) => acc + item.itemPrice, 0)
      )
      expect(jsonResponse.invoiceNo).toBe('1')
      expect(jsonResponse.invoiceDate).toBeDefined()

      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with ZodError error, invalid data', async () => {
      const mockInvoice: CreateInvoiceRequest['body'] = {
        client: '12456456',
        user: '123456',
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }
      const req = {
        body: mockInvoice
      } as unknown as CreateInvoiceRequest

      const res = buildRes()
      const next = buildNext()

      await invoiceController.create(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(expect.any(ZodError))
    })

    it('should call next with mongoose error, userId of clientId not found', async () => {
      const mockInvoice: CreateInvoiceRequest['body'] = {
        client: getObjectId(),
        user: getObjectId(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }
      const req = {
        body: mockInvoice
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
        user: user._id.toString(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const req = {
        body: mockInvoice
      } as unknown as CreateInvoiceRequest

      const res = buildRes()
      const next = buildNext()

      await invoiceController.create(req, res, next)
      expect(res.status).toHaveBeenCalledWith(201)

      const jsonResponse = (res.json as jest.Mock).mock.calls[0][0] as Invoice
      expect(jsonResponse.invoiceNo).toBe('1')

      await invoiceController.create(req, res, next)
      expect(res.status).toHaveBeenCalledWith(201)

      const jsonResponse2 = (res.json as jest.Mock).mock.calls[1][0] as Invoice
      expect(jsonResponse2.invoiceNo).toBe('2')
    })

    it('should start invoiceNo from 1, new year', async () => {
      const client = await ClientModel.create(getNewClient())
      const user = await UserModel.create(getNewUser())

      const mockInvoice: CreateInvoiceRequest['body'] = {
        client: client._id.toString(),
        user: user._id.toString(),
        invoiceDate: new Date('2021-12-31').toISOString(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const req = {
        body: mockInvoice
      } as unknown as CreateInvoiceRequest

      const res = buildRes()
      const next = buildNext()

      await invoiceController.create(req, res, next)
      expect(res.status).toHaveBeenCalledWith(201)

      const jsonResponse = (res.json as jest.Mock).mock.calls[0][0] as Invoice
      expect(jsonResponse.invoiceNo).toBe('1')

      await InvoiceModel.deleteMany()

      await invoiceController.create(req, res, next)
      expect(res.status).toHaveBeenCalledWith(201)

      const jsonResponse2 = (res.json as jest.Mock).mock.calls[1][0] as Invoice
      expect(jsonResponse2.invoiceNo).toBe('1')
    })
  })

  describe('Find', () => {
    it('should find all invoices', async () => {
      const client = await ClientModel.create(getNewClient())
      const user = await UserModel.create(getNewUser())

      const mockInvoices: Array<CreateInvoiceRequest['body']> = Array(10)
        .fill(null)
        .map(() => ({
          client: client._id.toString(),
          user: user._id.toString(),
          items: Array(10)
            .fill(null)
            .map(() => ({
              itemName: getProductName(),
              itemPrice: getProductPrice()
            }))
        }))

      const expectedInvoices = await InvoiceModel.create(mockInvoices)

      const req = {} as unknown as CreateInvoiceRequest

      const res = buildRes()
      const next = buildNext()

      await invoiceController.find(req, res, next)
      expect(res.status).toHaveBeenCalledWith(200)
      const jsonResponse = (res.json as jest.Mock).mock.calls[0][0] as Invoice[]
      expect(jsonResponse.length).toBe(expectedInvoices.length)
    })

    it('should find invoice by id', async () => {
      const client = await ClientModel.create(getNewClient())
      const user = await UserModel.create(getNewUser())

      const mockInvoice: CreateInvoiceRequest['body'] = {
        client: client._id.toString(),
        user: user._id.toString(),
        items: Array(10)
          .fill(null)
          .map(() => ({
            itemName: getProductName(),
            itemPrice: getProductPrice()
          }))
      }

      const expectedInvoice = await InvoiceModel.create(mockInvoice)

      const req = {
        params: {
          id: expectedInvoice._id.toString()
        }
      } as unknown as findInvoiceByIdRequest

      const res = buildRes()
      const next = buildNext()

      await invoiceController.findById(req, res, next)
      expect(res.status).toHaveBeenCalledWith(200)
      const jsonResponse = (res.json as jest.Mock).mock
        .calls[0][0] as Invoice & { _id: string }
      expect(jsonResponse._id.toString()).toBe(expectedInvoice._id.toString())
    })
  })
})
