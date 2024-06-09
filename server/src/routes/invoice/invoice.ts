import invoiceController from '@/controllers/invoice'
import { Router, json } from 'express'

const invoiceRoute = Router()

invoiceRoute.use(json())

invoiceRoute.post('/invoices', (req, res, next) => {
  void invoiceController.create(req, res, next)
})

invoiceRoute.get('/invoices', (req, res, next) => {
  void invoiceController.findAll(req, res, next)
})

invoiceRoute.get('/invoices/:id', (req, res, next) => {
  void invoiceController.findOne(req, res, next)
})

invoiceRoute.put('/invoices/:id', (req, res, next) => {
  void invoiceController.updateOne(req, res, next)
})

invoiceRoute.delete('/invoices/:id', (req, res, next) => {
  void invoiceController.deleteOne(req, res, next)
})

export default invoiceRoute
