import * as api from '@/api/invoice'
import RHFSwitch from '@/components/RHF/RHFSwitch'
import { UpdateInvoice } from '@/validations'
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import { FormProvider, useForm } from 'react-hook-form'
import { invoiceByIdQueryOption } from '../-query-options/invoiceByIdQueryOption'

const currencyToSymbol = (currency: string) => {
  switch (currency) {
    case 'USD':
      return '$'
    case 'EUR':
      return '€'
    case 'GBP':
      return '£'
    default:
      return ''
  }
}

const InvoiceByIdForm = () => {
  const { id } = useParams({ from: '/_auth/_layout/invoices/$id' })
  const options = invoiceByIdQueryOption(id)

  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const { data } = useSuspenseQuery(options)
  const formMethods = useForm<UpdateInvoice>({
    values: {
      paid: data?.paid
    }
  })
  const mutaton = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInvoice }) =>
      api.updateInvoice(id, data),
    onSuccess: (data) => {
      enqueueSnackbar('Invoice updated', { variant: 'success' })
      queryClient.setQueryData(options.queryKey, data)
    },
    onError: () => {
      enqueueSnackbar('Error updating invoice', { variant: 'error' })
    }
  })
  const {
    handleSubmit,
    formState: { isDirty }
  } = formMethods
  const onSubmit = (data: UpdateInvoice) => {
    mutaton.mutate({ id, data })
  }

  const currencySymbol = currencyToSymbol(data?.currency)
  const invoiceSum = data?.items.reduce(
    (acc, item) => acc + item.itemPrice * item.itemQuantity,
    0
  )
  const invoiceTax = (invoiceSum * data.taxPercentage) / 100

  return (
    <FormProvider {...formMethods}>
      <Grid
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        container
        spacing={4}
      >
        <Grid item container xs={12} spacing={3} alignItems="flex-start">
          <Grid item container xs={6} spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6">Invoice</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Date</Typography>
              <Typography variant="body1">
                {data && dayjs(data.invoiceDate).format('DD/MM/YYYY')}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" flexWrap="wrap" gap="0.5em">
                <Typography variant="body2">Invoice n°:</Typography>
                <Typography variant="body1">{data?.invoiceNo}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Status</Typography>
              <Typography variant="body1" textTransform="capitalize">
                {data?.status}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <RHFSwitch name="paid" label="Paid" />
            </Grid>
          </Grid>

          <Grid item container xs={6} spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6">Client</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">Name</Typography>
              <Typography variant="body1">{data?.client?.name}</Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Items</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell variant="head">Description</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell align="right">{item.itemQuantity}</TableCell>
                    <TableCell align="right">{`${currencySymbol}${item.itemPrice}`}</TableCell>
                    <TableCell align="right">
                      {`${currencySymbol}${item.itemPrice * item.itemQuantity}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Totals</Typography>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" variant="head">
                    Sum
                  </TableCell>
                  <TableCell align="right">{`${currencySymbol}${invoiceSum}`}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {`Tax(${data.taxPercentage}%)`}
                  </TableCell>
                  <TableCell align="right">{`${currencySymbol}${invoiceTax}`}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Total
                  </TableCell>
                  <TableCell align="right">{`${currencySymbol}${data?.totalAmount}`}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isDirty}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  )
}

export default InvoiceByIdForm
