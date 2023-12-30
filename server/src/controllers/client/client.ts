import ClientModel from '@/model/client'
import { clientSchema, createClientSchema } from '@/validation/client'
import { type NextFunction, type Request, type Response } from 'express'

const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsedClient = createClientSchema.parse(req.body)
    const client = new ClientModel(parsedClient)

    const newClient = await client.save()

    const returedClient = clientSchema.parse(newClient.toJSON())

    res.status(201).json(returedClient)
  } catch (error: unknown) {
    next(error)
  }
}

const find = async (
  req: Request,
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
  req: Request,
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
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const updates = createClientSchema.partial().parse(req.body)

    const client = await ClientModel.findById(id)

    if (client !== null) {
      client.name = updates.name ?? client.name
      client.email = updates.email ?? client.email
      client.address = updates.address ?? client.address

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
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const client = await ClientModel.findByIdAndDelete(id)
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

const clientController = {
  create,
  find,
  findById,
  update,
  deleteById
}

export default clientController
