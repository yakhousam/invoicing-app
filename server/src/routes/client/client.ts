import clientController from '@/controllers/client'
import { Router, json } from 'express'

const clientRoute = Router()

clientRoute.use(json())

clientRoute.get('/clients', (req, res, next) => {
  void clientController.findAll(req, res, next)
})

clientRoute.get('/clients/:id', (req, res, next) => {
  void clientController.findOne(req, res, next)
})

// create a new client
clientRoute.post('/clients', (req, res, next) => {
  void clientController.create(req, res, next)
})

// update a client
clientRoute.put('/clients/:id', (req, res, next) => {
  void clientController.updateOne(req, res, next)
})

// delete a client
clientRoute.delete('/clients/:id', (req, res, next) => {
  void clientController.deleteOne(req, res, next)
})

export default clientRoute
