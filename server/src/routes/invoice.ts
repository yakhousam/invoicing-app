import { Router } from 'express'
import invoiceController from '@/controllers/invoice'

const invoiceRoute = Router()

invoiceRoute.post('/invoices/create', invoiceController.create)

export default invoiceRoute
