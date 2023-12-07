import { Router } from 'express'
import ClientController from '@/controllers/client'

const clientRoute = Router()

clientRoute.get('/clients', (req, res) => {
  void ClientController.find(req, res)
})

clientRoute.get('/clients/:id', (req, res) => {
  void ClientController.findById(req, res)
})

clientRoute.post('/clients/create', (req, res) => {
  void ClientController.create(req, res)
})

export default clientRoute
