import { Router } from 'express'
import invoiceController from '@/controllers/invoice'

const invoiceRoute = Router()

invoiceRoute.post('/invoices/create', (req, res, next) => {
  void invoiceController.create(req, res, next)
})

invoiceRoute.get('/invoices', (req, res, next) => {
  void invoiceController.find(req, res, next)
})

export default invoiceRoute
