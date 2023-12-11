import { type Request, type Response, type NextFunction } from 'express'
import ClientModel, { type ClientType, zodClientSchema } from '@/model/client'

export type CreateClientRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  ClientType
>
export type ClientFindByIdType = Request<
  { id: string },
  Record<string, unknown>,
  Record<string, unknown>
>
export type ClientUpdateType = ClientFindByIdType & CreateClientRequest

const create = async (
  req: CreateClientRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, address } = req.body

    zodClientSchema.parse({ name, email, address })

    const client = new ClientModel({ name, email, address })

    const newClient = await client.save()

    res.status(201).json(newClient)
  } catch (error: unknown) {
    next(error)
  }
}

const find = async (
  req: unknown,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clients = await ClientModel.find()
    res.status(200).json(clients)
  } catch (error: unknown) {
    next(error)
  }
}

const findById = async (
  req: ClientFindByIdType,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const client = await ClientModel.findById(id)
    if (client !== null) {
      res.status(200).json(client)
    } else {
      res.status(404).json({
        error: 'Not found',
        message: `Client with id: ${id} doesn't exist`
      })
    }
  } catch (error: unknown) {
    next(error)
  }
}

const update = async (
  req: ClientUpdateType,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const { name, email, address } = req.body

    const client = await ClientModel.findById(id)

    if (client !== null) {
      zodClientSchema.parse({ name, email, address })
      client.name = name
      client.email = email
      client.address = address

      const updatedClient = await client.save()

      res.status(200).json(updatedClient)
    } else {
      res.status(404).json({
        error: 'Not found',
        message: `Client with id: ${id} doesn't exist`
      })
    }
  } catch (error: unknown) {
    next(error)
  }
}

const deleteById = async (
  req: ClientFindByIdType,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const client = await ClientModel.findByIdAndDelete(id)
    if (client !== null) {
      res.status(204).json(client)
    } else {
      res.status(404).json({
        error: 'Not found',
        message: `Client with id: ${id} doesn't exist`
      })
    }
  } catch (error: unknown) {
    next(error)
  }
}

const Client = {
  create,
  find,
  findById,
  update,
  deleteById
}

export default Client
