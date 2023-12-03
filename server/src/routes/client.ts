import { Router } from 'express'
import Client from '../controllers/client'

const clientRoute = Router()

clientRoute.post('/clients/create', Client.create)

export default clientRoute
