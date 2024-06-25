import {
  type CreateClient,
  type CreateUser,
  type Role,
  type User
} from '@/validation'
import { faker } from '@faker-js/faker'
import axios from 'axios'
import { type NextFunction, type Response } from 'express'

export const getObjectId = (): string => faker.database.mongodbObjectId()
export const getPassword = (): string => faker.internet.password()
export const getProductName = (): string => faker.commerce.productName()
export const getProductPrice = (): number => Number(faker.commerce.price())
export const getTaxPercentage = (): number =>
  Number(faker.finance.amount(0, 100, 2))
export const getCurrency = (): 'USD' | 'EUR' | 'GBP' => {
  const currencies = ['USD', 'EUR', 'GBP'] as const
  const randomIndex = Math.floor(Math.random() * currencies.length)
  return currencies[randomIndex]
}

export function buildRes(overrides = {}): Response {
  const res = {
    json: jest.fn(() => res).mockName('json'),
    status: jest.fn(() => res).mockName('status'),
    sendStatus: jest.fn(() => res).mockName('sendStatus'),
    cookie: jest.fn(() => res).mockName('cookie'),
    clearCookie: jest.fn(() => res).mockName('clearCookie'),
    ...overrides
  } as unknown as Response
  return res
}

export function buildNext(): NextFunction {
  return jest.fn().mockName('next') as unknown as NextFunction
}

export const getNewClient = <T>(userId: T): CreateClient & { userId: T } => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  address: faker.location.streetAddress(),
  userId
})

export const getNewUser = (role?: Role): CreateUser => ({
  userName: faker.person.fullName(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: role ?? 'user'
})

export const getCredentials = async (
  port: number,
  role?: Role
): Promise<{ cookie: string; user: User }> => {
  const api = axios.create({ baseURL: `http://localhost:${port}/api/v1` })
  const user = getNewUser(role)
  const response = await api.post<User>('/auth/register', user)
  const cookies = response.headers['set-cookie']
  const token = cookies
    ?.find((cookie) => cookie.includes('token'))
    ?.split(';')[0]
    .split('=')[1]
  return { cookie: `token=${token}`, user: response.data }
}
