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

clientRoute.put('/clients/update/:id', (req, res) => {
  void ClientController.update(req, res)
})

clientRoute.delete('/clients/delete/:id', (req, res) => {
  void ClientController.delete(req, res)
})

export default clientRoute
