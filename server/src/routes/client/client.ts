import clientController from '@/controllers/client'
import { Router, json } from 'express'

const clientRoute = Router()

clientRoute.use(json())

clientRoute.get('/clients', (req, res, next) => {
  void clientController.find(req, res, next)
})

clientRoute.get('/clients/:id', (req, res, next) => {
  void clientController.findById(req, res, next)
})

// create a new client
clientRoute.post('/clients', (req, res, next) => {
  void clientController.create(req, res, next)
})

// update a client
clientRoute.put('/clients/:id', (req, res, next) => {
  void clientController.update(req, res, next)
})

// delete a client
clientRoute.delete('/clients/:id', (req, res, next) => {
  void clientController.deleteById(req, res, next)
})

export default clientRoute
