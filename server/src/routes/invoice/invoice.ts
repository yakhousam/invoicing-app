import invoiceController from '@/controllers/invoice'
import { Router, json } from 'express'

const invoiceRoute = Router()

invoiceRoute.use(json())

invoiceRoute.post('/invoices/me', (req, res, next) => {
  void invoiceController.create(req, res, next)
})

invoiceRoute.get('/invoices/me', (req, res, next) => {
  void invoiceController.findAll(req, res, next)
})

invoiceRoute.get('/invoices/me/summary', (req, res, next) => {
  void invoiceController.getSummary(req, res, next)
})

invoiceRoute.get('/invoices/me/totals-by-month', (req, res, next) => {
  void invoiceController.getTotalsByMonth(req, res, next)
})

invoiceRoute.get('/invoices/me/:id', (req, res, next) => {
  void invoiceController.findOne(req, res, next)
})

invoiceRoute.put('/invoices/me/:id', (req, res, next) => {
  void invoiceController.updateOne(req, res, next)
})

invoiceRoute.delete('/invoices/me/:id', (req, res, next) => {
  void invoiceController.deleteOne(req, res, next)
})

export default invoiceRoute
