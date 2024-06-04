import * as api from '@/api/invoice'
import {
  LoadingButtonDelete,
  LoadingButtonSave
} from '@/components/LoadingButton'
import RHFSwitch from '@/components/RHF/RHFSwitch'
import { formatCurrency } from '@/helpers'
import { UpdateInvoice } from '@/validations'
import {
  Box,
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
import DownloadInvoiceBtn from './DownloadInvoiceBtn'

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
  const { mutate: updateInvoice, isPending: isPendingSaving } = useMutation({
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

  const { mutate: deleteInvoice, isPending: isPendingDeletion } = useMutation({
    mutationFn: (id: string) => api.deleteInvoice(id),
    onSuccess: () => {
      enqueueSnackbar('Invoice deleted', { variant: 'success' })
      queryClient.invalidateQueries({
        queryKey: options.queryKey,
        refetchType: 'none'
      })
    },
    onError: (error) => {
      enqueueSnackbar('Error deleting invoice', { variant: 'error' })
      console.error(error)
    }
  })

  const {
    handleSubmit,
    formState: { isDirty }
  } = formMethods

  const onSubmit = (data: UpdateInvoice) => {
    updateInvoice({ id, data })
  }

  const amountToCurrency = formatCurrency(data.currency)

  return (
    <>
      <FormProvider {...formMethods}>
        <Grid
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          container
          spacing={4}
        >
          <Grid item container xs={12} spacing={3} alignItems="flex-start">
            <Grid item xs={12}>
              <DownloadInvoiceBtn {...data} />
            </Grid>
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
                      <TableCell align="right">
                        {amountToCurrency(item.itemPrice)}
                      </TableCell>
                      <TableCell align="right">
                        {amountToCurrency(
                          parseFloat(
                            (item.itemPrice * item.itemQuantity).toFixed(2)
                          )
                        )}
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
                      Net Total(EXCL. TAX)
                    </TableCell>
                    <TableCell align="right">
                      {amountToCurrency(data.subTotal)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {data.taxPercentage > 0
                        ? `Tax(${data.taxPercentage}%)`
                        : 'Tax(N/A)'}
                    </TableCell>
                    <TableCell align="right">
                      {data.taxAmount > 0
                        ? amountToCurrency(data.taxAmount)
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Total(Incl. TAX)
                    </TableCell>
                    <TableCell align="right">
                      {amountToCurrency(data.totalAmount)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <LoadingButtonSave
                type="submit"
                loading={isPendingSaving}
                disabled={!isDirty}
              />

              <LoadingButtonDelete
                loading={isPendingDeletion}
                onClick={() => deleteInvoice(id)}
              />
            </Box>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  )
}

export default InvoiceByIdForm
