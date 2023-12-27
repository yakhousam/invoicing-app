import { type Role } from '@/middlewars/role'
import { type Client } from '@/model/client'
import { type User } from '@/model/user'
import { type ReturnedUser } from '@/routes/auth/auth.test'
import { faker } from '@faker-js/faker'
import axios from 'axios'
import { type NextFunction, type Response } from 'express'

export const getName = (): string => faker.person.fullName()
export const getEmail = (): string => faker.internet.email()
export const getAdress = (): string => faker.location.streetAddress()
export const getObjectId = (): string => faker.database.mongodbObjectId()
export const getPassword = (): string => faker.internet.password()
export const getProductName = (): string => faker.commerce.productName()
export const getProductPrice = (): number => Number(faker.commerce.price())

export function buildRes(overrides = {}): Response {
  const res = {
    json: jest.fn(() => res).mockName('json'),
    status: jest.fn(() => res).mockName('status'),
    sendStatus: jest.fn(() => res).mockName('sendStatus'),
    cookie: jest.fn(() => res).mockName('cookie'),
    ...overrides
  } as unknown as Response
  return res
}

export function buildNext(): NextFunction {
  return jest.fn().mockName('next') as unknown as NextFunction
}

export const getNewClient = (): Pick<Client, 'name' | 'email' | 'address'> => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  address: faker.location.streetAddress()
})

export const getNewUser = (
  role?: Role
): Pick<User, 'name' | 'email' | 'password' | 'role'> => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: role ?? 'user'
})

export const getCredentials = async (
  port: number,
  role?: Role
): Promise<{ cookie: string; user: ReturnedUser }> => {
  const api = axios.create({ baseURL: `http://localhost:${port}/api/v1` })
  const user = getNewUser(role)
  const response = await api.post<ReturnedUser>('/auth/signup', user)
  const cookies = response.headers['set-cookie']
  const token = cookies
    ?.find((cookie) => cookie.includes('token'))
    ?.split(';')[0]
    .split('=')[1]
  return { cookie: `token=${token}`, user: response.data }
}
