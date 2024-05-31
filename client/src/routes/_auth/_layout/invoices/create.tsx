import * as api from '@/api/invoice'
import RHFDatePicker from '@/components/RHF/RHFDatePicker'
import RHFSelect from '@/components/RHF/RHFSelect'
import RHFTextField from '@/components/RHF/RHFTextField'
import { CreateInvoice, creatInvoiceSchema } from '@/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Button, IconButton } from '@mui/material'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { clientQueryOptions } from '../clients/-query-options/clientQueryOption'

const currencies = ['USD', 'EUR', 'GBP']

export const Route = createFileRoute('/_auth/_layout/invoices/create')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(clientQueryOptions),
  component: CreateInvoiceCmp
})

function CreateInvoiceCmp() {
  const { data: clients } = useSuspenseQuery(clientQueryOptions)
  const mutation = useMutation({
    mutationFn: api.createInvoice,
    onSuccess: () => {
      alert('Invoice created')
    },
    onError: (error) => {
      alert(error)
    }
  })
  const methods = useForm<CreateInvoice>({
    resolver: zodResolver(creatInvoiceSchema),
    defaultValues: {
      invoiceDueDays: 7,
      invoiceDate: dayjs().startOf('day').hour(1).toISOString(),
      client: {
        _id: ''
      },
      items: [
        {
          itemName: '',
          itemPrice: 0,
          itemQuantity: 1
        }
      ],
      currency: 'EUR',
      taxPercentage: 0
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'items'
  })

  const {
    handleSubmit,
    formState: { errors }
  } = methods
  const onSubmit = (data: CreateInvoice) => {
    if (mutation.isPending) {
      return
    }
    mutation.mutate(data)
  }
  console.log('errors', errors)
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="column" gap={2}>
          <RHFTextField
            type="number"
            name="invoiceDueDays"
            label="Invoice due days"
            autoComplete="invoice due days"
          />
          <RHFDatePicker
            type="date"
            name="invoiceDate"
            label="Invoice date"
            autoComplete="invoice date"
          />
          <RHFSelect
            name="client._id"
            label="Client"
            options={clients?.map((client) => ({
              value: client._id,
              label: client.name
            }))}
          />
          <RHFSelect
            name="currency"
            label="Currency"
            options={currencies.map((currency) => ({
              value: currency,
              label: currency
            }))}
          />
          <RHFTextField
            type="number"
            name="taxPercentage"
            label="Tax percentage"
            autoComplete="tax percentage"
          />

          {fields.map((field, index) => (
            <Box
              key={field.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <IconButton
                aria-label="add"
                color="primary"
                disabled={index !== fields.length - 1}
                onClick={() =>
                  append({
                    itemName: '',
                    itemPrice: 0,
                    itemQuantity: 1
                  })
                }
                sx={{ alignSelf: 'flex-start' }}
              >
                <AddCircleIcon />
              </IconButton>

              <RHFTextField
                name={`items[${index}].itemName`}
                label="Name"
                autoComplete="item name"
              />

              <RHFTextField
                type="number"
                name={`items[${index}].itemPrice`}
                label="Price"
                autoComplete="item price"
              />

              <RHFTextField
                type="number"
                name={`items[${index}].itemQuantity`}
                label="Quantity"
                autoComplete="item quantity"
              />
              <IconButton
                disabled={fields.length === 1}
                aria-label="delete"
                color="error"
                onClick={() => remove(index)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <Button type="submit" variant="contained">
            Create invoice
          </Button>
          <p>{errors.items?.message}</p>
        </Box>
      </form>
    </FormProvider>
  )
}
