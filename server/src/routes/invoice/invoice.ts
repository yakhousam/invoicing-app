import invoiceController from '@/controllers/invoice'
import { Router } from 'express'

const invoiceRoute = Router()

invoiceRoute.post('/invoices/create', (req, res, next) => {
  void invoiceController.create(req, res, next)
})

invoiceRoute.get('/invoices', (req, res, next) => {
  void invoiceController.find(req, res, next)
})

invoiceRoute.get('/invoices/:id', (req, res, next) => {
  void invoiceController.findById(req, res, next)
})

export default invoiceRoute
