import { Router } from 'express'
import ClientController from '@/controllers/client'

const clientRoute = Router()

clientRoute.get('/clients', (req, res, next) => {
  void ClientController.find(req, res, next)
})

clientRoute.get('/clients/:id', (req, res, next) => {
  void ClientController.findById(req, res, next)
})

clientRoute.post('/clients/create', (req, res, next) => {
  void ClientController.create(req, res, next)
})

clientRoute.put('/clients/update/:id', (req, res, next) => {
  void ClientController.update(req, res, next)
})

clientRoute.delete('/clients/delete/:id', (req, res, next) => {
  void ClientController.delete(req, res, next)
})

export default clientRoute
