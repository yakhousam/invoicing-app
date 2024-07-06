import { Client, Invoice, InvoiceArray, User } from '@/validations'
import { faker } from '@faker-js/faker'

export function generateUser(): Required<User> {
  return {
    _id: faker.database.mongodbObjectId(),
    userName: faker.internet.userName(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
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
    name: faker.person.fullName(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    createdAt: faker.date.recent().toISOString(),
    updatedAt: faker.date.recent().toISOString()
  }
}

export function generateInvoice(): Required<Invoice> {
  return {
    _id: faker.database.mongodbObjectId(),
    user: generateUser(),
    createdAt: faker.date.recent().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    client: generateClient(),
    status: 'sent',
    paid: false,
    currency: faker.helpers.arrayElement(['USD', 'EUR', 'GBP']),
    invoiceDate: faker.date.future().toISOString(),
    invoiceDueDays: faker.number.int({ min: 1, max: 30 }),
    invoiceNo: Number(faker.finance.accountNumber()),
    items: [
      {
        _id: faker.database.mongodbObjectId(),
        itemName: faker.commerce.productName(),
        itemQuantity: faker.number.int({ min: 1, max: 10 }),
        itemPrice: Number(faker.finance.amount())
      }
    ],
    invoiceNoString: faker.finance.accountNumber(),
    subTotal: Number(faker.finance.amount()),
    taxAmount: Number(faker.finance.amount()),
    taxPercentage: faker.number.int({ min: 0, max: 20 }),
    totalAmount: Number(faker.finance.amount())
  }
}

export function generateInvoices(): Required<InvoiceArray> {
  return Array.from({ length: 10 }, () => ({
    ...generateInvoice(),
    user: generateUser()._id
  }))
}
