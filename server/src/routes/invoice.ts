import { Router } from 'express'
import Invoice from '../controllers/invoice'

const invoiceRoute = Router()

invoiceRoute.post('/invoices/create', Invoice.create)

export default invoiceRoute
