import { type Request, type Response } from 'express'
import ClientModel, { type ClientType, zodClientSchema } from '@/model/client'
import { ZodError } from 'zod'

export type CreateClientRequest = Request<Record<string, unknown>, Record<string, unknown>, ClientType>

const create = async (req: CreateClientRequest, res: Response): Promise<void> => {
  try {
    const { name, email, address } = req.body

    zodClientSchema.parse({ name, email, address })

    const client = new ClientModel({ name, email, address })

    const newClient = await client.save()

    res.status(201).json(newClient)
  } catch (error: unknown) {
    if (error instanceof (ZodError)) {
      res.status(400).json({ errors: error.flatten().fieldErrors, message: 'Missing Fields. Failed to Create Invoice.' })
    } else {
      res.sendStatus(500)
    }
  }
}

const find = async (req: unknown, res: Response): Promise<void> => {
  try {
    const clients = await ClientModel.find()
    res.status(200).json(clients)
  } catch (error: unknown) {
    res.sendStatus(500)
  }
}

const Client = {
  create,
  find
}

export default Client
