import { Invoice } from '@/validations'

export const formatCurrency = (currency: Invoice['currency']) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  })
  return (amount: number) => formatter.format(amount)
}
