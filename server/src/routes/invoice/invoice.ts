import invoiceController from '@/controllers/invoice'
import { type User } from '@/model/user'
import { type CreateInvoice } from '@/types'
import { Router, type Request } from 'express'

const invoiceRoute = Router()

invoiceRoute.post('/invoices/create', (req, res, next) => {
  void invoiceController.create(
    req as unknown as Request<null, null, CreateInvoice> & { user: User },
    res,
    next
  )
})

invoiceRoute.get('/invoices', (req, res, next) => {
  void invoiceController.find(req as Request & { user: User }, res, next)
})

invoiceRoute.get('/invoices/:id', (req, res, next) => {
  void invoiceController.findById(
    req as Request<{ id: string }> & { user: User },
    res,
    next
  )
})

export default invoiceRoute
