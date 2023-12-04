import { Router } from 'express'
import Client from '../controllers/client'

const clientRoute = Router()

clientRoute.post('/clients/create', (req, res) => {
  void Client.create(req, res)
})

export default clientRoute
