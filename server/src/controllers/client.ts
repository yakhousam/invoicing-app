import { type Request, type Response } from 'express'
import ClientModel, { type ClientType, zodClientSchema } from '../model/client'

type CreateClientRequest = Request<Record<string, unknown>, Record<string, unknown>, ClientType>

const create = (req: CreateClientRequest, res: Response): void => {
  try {
    zodClientSchema.parse(req.body)
    const { name, email, address } = req.body
    const client = new ClientModel({ name, email, address })
    client.save()
      .then(client => res.status(201).json(client))
      .catch((e) => res.status(409).json(e))
  } catch (error) {
    console.error(error)
    res.sendStatus(400)
  }
}

const Client = {
  create
}

export default Client
