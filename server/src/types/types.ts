import { type Client } from '@/model/client'
import { type Invoice } from '@/model/invoice'
import { type User } from '@/model/user'

export type { User } from '@/model/user'

// JSON REQUEST

export type CreateUser = Pick<User, 'name' | 'email'>

export type CreateClient = Pick<Client, 'name' | 'email' | 'address'>

export type CreateInvoice = Pick<Invoice, 'items'> & {
  client: string
  invoiceDate?: string
  dueDate?: string
}

/*
{
    invoiceDate: Date;
    user: Types.ObjectId;
    client: Types.ObjectId;
    items: {
        itemName: string;
        itemPrice: number;
        itemQuantity?: number | undefined;
    }[];
    paid: boolean;
    invoiceNo?: number | undefined;
    dueDate?: Date | undefined;
    totalAmount?: number | undefined;
}

*/

// JSON RESPONSE

export type UserJson = Required<Pick<User, 'name' | 'email' | 'role'>>

export type ClientJson = Pick<Client, 'name' | 'email' | 'address'>

export type InvoiceJson = Required<
  Pick<
    Invoice,
    | '_id'
    | 'invoiceNo'
    | 'invoiceDate'
    | 'dueDate'
    | 'paid'
    | 'totalAmount'
    | 'items'
    | 'client'
    | 'user'
  >
> & {
  invoiceDate: string
  dueDate: string
  status: 'sent' | 'paid' | 'overdue'
}

export type InvoiceByIdJson = InvoiceJson & {
  client: ClientJson
  user: UserJson
}
