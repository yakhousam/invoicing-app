import { Client, User } from '@/validations'
import { faker } from '@faker-js/faker'

export function generateUser(): Required<User> {
  return {
    _id: faker.database.mongodbObjectId(),
    userName: faker.internet.userName(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    role: 'user',
    createdAt: faker.date.recent().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    signatureUrl: faker.image.url()
  }
}

export function generateClient(): Required<Client> {
  return {
    _id: faker.database.mongodbObjectId(),
    userId: faker.database.mongodbObjectId(),
    name: faker.company.name(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    createdAt: faker.date.recent().toISOString(),
    updatedAt: faker.date.recent().toISOString()
  }
}
