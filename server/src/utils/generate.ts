import { type ClientType } from '@/model/client'
import { type UserType } from '@/model/user'
import { faker } from '@faker-js/faker'
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
    ...overrides
  } as unknown as Response
  return res
}

export function buildNext(): NextFunction {
  return jest.fn().mockName('next') as unknown as NextFunction
}

export const getNewClient = (): ClientType => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  address: faker.location.streetAddress()
})

export const getNewUser = (): UserType => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  isValidPassword: async () => true
})
