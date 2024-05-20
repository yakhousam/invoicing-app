import { User } from '@/validations'
import { faker } from '@faker-js/faker'

export function generateUser(): User {
  return {
    _id: faker.database.mongodbObjectId(),
    name: faker.internet.userName(),
    email: faker.internet.email(),
    role: 'user',
    createdAt: faker.date.recent().toISOString(),
    updatedAt: faker.date.recent().toISOString()
  }
}
