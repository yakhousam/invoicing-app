import {
  Client,
  Invoice,
  InvoiceArray,
  User,
  invoicesSummary,
  invoicesTotalsByMonth
} from '@/validations'
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

export function generateClients(): Required<Client[]> {
  return Array.from({ length: 10 }, () => generateClient())
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

export function generateInvoicesTotalsByMonth(): invoicesTotalsByMonth {
  return Array.from({ length: 10 }, () => ({
    date: {
      month: faker.number.int({ min: 1, max: 12 }),
      year: faker.number.int({ min: 2010, max: 2020 })
    },
    total: faker.number.int({ min: 10, max: 10000 }),
    paid: faker.number.int({ min: 1, max: 10 }),
    unpaid: faker.number.int({ min: 1, max: 10 })
  }))
}

export function generateInvoicesSummary(): invoicesSummary {
  return [
    {
      currency: faker.helpers.arrayElement(['USD', 'EUR', 'GBP']),
      total: faker.number.int({ min: 10, max: 10000 }),
      paid: faker.number.int({ min: 1, max: 10000 }),
      unpaid: faker.number.int({ min: 1, max: 10000 })
    }
  ]
}
