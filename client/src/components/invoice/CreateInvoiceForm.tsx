import * as api from '@/api/invoice'
import RHFDatePicker from '@/components/RHF/RHFDatePicker'
import RHFSelect from '@/components/RHF/RHFSelect'
import RHFTextField from '@/components/RHF/RHFTextField'
import { formatCurrency } from '@/helpers'
import { clientsOptions, invoicesOptions } from '@/queries'
import { CreateInvoice, Invoice, createInvoiceSchema } from '@/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Button, Grid, IconButton, Stack, Typography } from '@mui/material'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'

const currencies: Array<Invoice['currency']> = ['USD', 'EUR', 'GBP']

function CreateInvoiceForm() {
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()

  const { data: clients } = useSuspenseQuery(clientsOptions)

  const mutation = useMutation({
    mutationFn: api.createInvoice,
    onSuccess: (data) => {
      enqueueSnackbar('Invoice created', { variant: 'success' })
      methods.reset()
      // this is a hack to reset the date (time) field so it doesn't keep the previous value.
      // otherwise if you create a new invoice the date will be the same as the previous one when you don't refresh the page
      methods.setValue('invoiceDate', dayjs().toISOString())
      queryClient.setQueryData(invoicesOptions().queryKey, (oldData) => {
        if (!oldData) {
          return {
            invoices: [
              {
                ...data,
                user: data.user.userName
              }
            ],
            totalInvoices: 1
          }
        }

        return {
          ...oldData,
          invoices: [
            {
              ...data,
              user: data.user.userName
            },
            ...oldData.invoices
          ],
          totalInvoices: oldData.totalInvoices + 1
        }
      })
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' })
      console.error(error)
    }
  })
  const methods = useForm<CreateInvoice>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      invoiceDueDays: 7,
      invoiceDate: dayjs().toISOString(),
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

  const amountToCurrency = formatCurrency(methods.watch('currency'))

  const subTotal = methods
    .watch('items')
    .reduce((acc, item) => acc + item.itemPrice * (item.itemQuantity || 0), 0)

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <RHFTextField
              type="number"
              name="invoiceDueDays"
              label="Invoice due days"
              autoComplete="invoice due days"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <RHFDatePicker
              type="date"
              name="invoiceDate"
              label="Invoice date"
              autoComplete="invoice date"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <RHFSelect
              name="client._id"
              label="Client"
              options={clients?.map((client) => ({
                value: client._id,
                label: client.name
              }))}
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <RHFSelect
              name="currency"
              label="Currency"
              options={currencies.map((currency) => ({
                value: currency,
                label: currency
              }))}
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <RHFTextField
              type="number"
              name="taxPercentage"
              label="Tax percentage"
              autoComplete="tax percentage"
              variant="standard"
            />
          </Grid>
        </Grid>

        <Grid container spacing={4} mt={6}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold">
              Invoice Items
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                aria-label="add item"
                color="primary"
                variant="contained"
                onClick={() =>
                  append({
                    itemName: '',
                    itemPrice: 0,
                    itemQuantity: 1
                  })
                }
                startIcon={<AddCircleIcon />}
              >
                Add item
              </Button>
            </Box>
          </Grid>
          <Grid item container xs={12} spacing={2}>
            {fields.map((field, index) => (
              <Grid item container spacing={2} key={field.id}>
                <Grid item xs={12} sm={7.5}>
                  <RHFTextField
                    name={`items.${index}.itemName`}
                    label="Description"
                    autoComplete="item-description"
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <RHFTextField
                    type="number"
                    name={`items.${index}.itemPrice`}
                    label="Price"
                    autoComplete="item price"
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={12} sm={2.5}>
                  <Box display="flex" alignItems="center">
                    <RHFTextField
                      type="number"
                      name={`items.${index}.itemQuantity`}
                      label="Quantity"
                      autoComplete="item quantity"
                      variant="standard"
                    />
                    <IconButton
                      disabled={fields.length === 1}
                      aria-label="delete item"
                      color="error"
                      onClick={() => remove(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={6}>
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold">
              Totals
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">Subtotal</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              aria-label="Sub total"
              variant="body1"
              textAlign="right"
            >
              {amountToCurrency(subTotal)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              Tax ({methods.watch('taxPercentage')}%)
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              aria-label="Total tax"
              variant="body1"
              textAlign="right"
            >
              {amountToCurrency(
                (subTotal * (methods.watch('taxPercentage') || 0)) / 100
              )}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">Total</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              aria-label="Grand total"
              variant="body1"
              textAlign="right"
            >
              {amountToCurrency(
                subTotal +
                  (subTotal * (methods.watch('taxPercentage') || 0)) / 100
              )}
            </Typography>
          </Grid>
        </Grid>

        <Stack mt={4} spacing={2}>
          <Button
            type="submit"
            variant="contained"
            sx={{ alignSelf: 'flex-start' }}
          >
            Create invoice
          </Button>
          <Typography
            variant="body1"
            sx={{ color: (theme) => theme.palette.error.main }}
          >
            {errors.items?.message}
          </Typography>
        </Stack>
      </form>
    </FormProvider>
  )
}

export default CreateInvoiceForm
