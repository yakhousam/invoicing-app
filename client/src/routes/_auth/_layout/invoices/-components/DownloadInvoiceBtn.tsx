import { Invoice } from '@/validations'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { Box, Button } from '@mui/material'
import { PDFDownloadLink } from '@react-pdf/renderer'
import dayjs from 'dayjs'
import InvoiceByIdPdf from './InvoiceByIdPdf'

const DownloadInvoiceBtn = (invoice: Invoice) => (
  <Box display="flex" justifyContent="flex-end">
    <PDFDownloadLink
      document={<InvoiceByIdPdf {...invoice} />}
      fileName={`${invoice.client.name}-${invoice.invoiceNoString}-${dayjs(invoice.invoiceDate).format('DD-MM-YYYY')}.pdf`}
    >
      {({ loading }) => (
        <Button variant="outlined" startIcon={<PictureAsPdfIcon />}>
          {loading ? 'Loading...' : 'Download'}
        </Button>
      )}
    </PDFDownloadLink>
  </Box>
)

export default DownloadInvoiceBtn
