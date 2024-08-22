import ClientModel from '@/model/client'
import { clientSchema, createClientSchema } from '@/validation/client'
import { parseUserSchema } from '@/validation/user'
import { type NextFunction, type Request, type Response } from 'express'

const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authenticatedUser = parseUserSchema.parse(req.user)
    const parsedClient = createClientSchema.parse(req.body)
    if (parsedClient.email === '') {
      parsedClient.email = undefined
    }

    if (parsedClient.email !== undefined) {
      // check for duplicate email
      const foundClient = await ClientModel.findOne({
        email: parsedClient.email,
        userId: authenticatedUser._id
      })

      if (foundClient !== null) {
        res.status(409).json({
          error: 'DuplicateKeyError',
          message: 'Email already exists',
          field: 'email',
          value: parsedClient.email
        })
        return
      }
    }

    const client = new ClientModel({
      ...parsedClient,
      userId: authenticatedUser._id
    })

    const newClient = await client.save()

    const returnedClient = clientSchema.parse(newClient.toJSON())

    res.status(201).json(returnedClient)
  } catch (error: unknown) {
    next(error)
  }
}

const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authenticatedUser = parseUserSchema.parse(req.user)
    const clients = await ClientModel.find({ userId: authenticatedUser._id })
    res.status(200).json(clients)
  } catch (error: unknown) {
    next(error)
  }
}

const findOne = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const authenticatedUser = parseUserSchema.parse(req.user)
    const client = await ClientModel.findOne({
      _id: id,
      userId: authenticatedUser._id
    })
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

const updateOne = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const authenticatedUser = parseUserSchema.parse(req.user)
    const updates = createClientSchema.partial().parse(req.body)

    const client = await ClientModel.findOne({
      _id: id,
      userId: authenticatedUser._id
    })

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

const deleteOne = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const authenticatedUser = parseUserSchema.parse(req.user)
    const client = await ClientModel.findOneAndDelete({
      _id: id,
      userId: authenticatedUser._id
    })
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
  findAll,
  findOne,
  updateOne,
  deleteOne
}

export default clientController
