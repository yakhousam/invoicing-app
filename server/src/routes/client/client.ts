import clientController from '@/controllers/client'
import { Router } from 'express'

const clientRoute = Router()

clientRoute.get('/clients', (req, res, next) => {
  void clientController.find(req, res, next)
})

clientRoute.get('/clients/:id', (req, res, next) => {
  void clientController.findById(req, res, next)
})

clientRoute.post('/clients/create', (req, res, next) => {
  void clientController.create(req, res, next)
})

clientRoute.put('/clients/update/:id', (req, res, next) => {
  void clientController.update(req, res, next)
})

clientRoute.delete('/clients/delete/:id', (req, res, next) => {
  void clientController.deleteById(req, res, next)
})

export default clientRoute
