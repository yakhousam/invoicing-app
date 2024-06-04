import { formatCurrency } from '@/helpers'
import { Invoice } from '@/validations'
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View
} from '@react-pdf/renderer'
import dayjs from 'dayjs'
import signature from './signature.png'

// Create styles
const styles = StyleSheet.create({
  page: {
    // backgroundColor: '#E4E4E4',
    padding: 50
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  header: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 18,
    fontWeight: 'bold'
  },
  title: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 2
  },
  text: {
    fontSize: 12,
    lineHeight: 2
  },
  tableHead: {
    fontFamily: 'Helvetica-Bold',
    backgroundColor: '#E4E4E4',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 2,
    padding: 10,
    paddingBottom: 0,
    textAlign: 'center',
    borderLeft: '0.5px solid black'
  },
  tableRow: {
    fontSize: 12,
    lineHeight: 2,
    padding: 10,
    maxWidth: 300,
    borderLeft: '0.5px solid black',
    textAlign: 'right'
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  },
  rowSummary: {
    width: 100,
    textAlign: 'right',
    borderRight: '0.5 solid black',
    paddingBottom: 0
  }
})

const InvoiceByIdPdf = (invoice: Invoice) => {
  const amountToCurrency = formatCurrency(invoice.currency)
  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={{ ...styles.flexRow, marginBottom: 80 }}>
            <Text style={styles.header}>{invoice.user.name}</Text>
            <Text style={styles.header}>INVOICE</Text>
          </View>
          <View style={styles.flexRow}>
            <View>
              <Text style={styles.title}>Bill To</Text>
              <Text style={styles.text}>{invoice.client.name}</Text>
            </View>
            <View style={{ ...styles.flexRow, gap: 20, marginBottom: 50 }}>
              <View
                style={{
                  display: 'flex',
                  alignItems: 'flex-end'
                }}
              >
                <Text style={styles.title}>Invoice #</Text>
                <Text style={styles.title}>Invoice Date</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  alignItems: 'flex-end'
                }}
              >
                <Text style={styles.text}>{invoice.invoiceNoString}</Text>
                <Text style={styles.text}>
                  {dayjs(invoice.invoiceDate).format('DD/MM/YYYY')}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ border: '0.5px solid black' }}>
            <View style={styles.flexRow}>
              <Text
                style={[styles.tableHead, { width: '55%', borderLeft: 'none' }]}
              >
                Description
              </Text>
              <Text style={[styles.tableHead, { width: '15%' }]}>Quantity</Text>
              <Text style={[styles.tableHead, { width: '15%' }]}>Price</Text>
              <Text style={[styles.tableHead, { width: '15%' }]}>Total</Text>
            </View>
            {invoice.items.map((item) => (
              <View key={item._id} style={styles.flexRow}>
                <Text
                  style={[
                    styles.tableRow,
                    { width: '55%', borderLeft: 'none', textAlign: 'left' }
                  ]}
                >
                  {item.itemName}
                </Text>
                <Text style={[styles.tableRow, { width: '15%' }]}>
                  {item.itemQuantity}
                </Text>
                <Text style={[styles.tableRow, { width: '15%' }]}>
                  {amountToCurrency(item.itemPrice)}
                </Text>
                <Text style={[styles.tableRow, { width: '15%' }]}>
                  {amountToCurrency(
                    parseFloat((item.itemPrice * item.itemQuantity).toFixed(2))
                  )}
                </Text>
              </View>
            ))}
            {/** add padding bottom to the table by adding extran empty row */}
            <View style={styles.flexRow}>
              <View
                style={[styles.tableRow, { width: '55%', borderLeft: 'none' }]}
              />
              <View style={[styles.tableRow, { width: '15%' }]} />
              <View style={[styles.tableRow, { width: '15%' }]} />
              <View style={[styles.tableRow, { width: '15%' }]} />
            </View>
          </View>

          <View style={[styles.flexRow, { justifyContent: 'flex-end' }]}>
            <View style={[styles.column, { gap: 0, alignItems: 'flex-end' }]}>
              <Text
                style={[styles.tableRow, styles.rowSummary, { width: 140 }]}
              >
                Net Total(EXCL. TAX)
              </Text>
              <Text
                style={[styles.tableRow, styles.rowSummary, { width: 140 }]}
              >
                {invoice.taxPercentage > 0
                  ? `Tax(${invoice.taxPercentage}%)`
                  : 'Tax(N/A)'}
              </Text>
              <Text
                style={[
                  styles.title,
                  styles.tableRow,
                  styles.rowSummary,
                  {
                    width: 140,
                    borderBottom: '0.5 solid black',
                    fontSize: 14
                  }
                ]}
              >
                Total(Incl. TAX)
              </Text>
            </View>
            <View style={[styles.column, { gap: 0 }]}>
              <Text style={[styles.tableRow, styles.rowSummary]}>
                {amountToCurrency(invoice.subTotal)}
              </Text>

              <Text style={[styles.tableRow, styles.rowSummary]}>
                {invoice.taxAmount > 0
                  ? amountToCurrency(invoice.taxAmount)
                  : 'N/A'}
              </Text>

              <Text
                style={[
                  styles.title,
                  styles.tableRow,
                  styles.rowSummary,
                  {
                    borderBottom: '0.5 solid black',
                    fontSize: 14
                  }
                ]}
              >
                {amountToCurrency(invoice.totalAmount)}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 20
            }}
          >
            <Image style={{ maxWidth: 200 }} src={signature} />
          </View>
          <View
            style={{
              marginTop: 'auto'
            }}
          >
            <Text style={[styles.title]}>Terms & Conditions</Text>

            <Text style={styles.text}>
              Payment is due within {invoice.invoiceDueDays} days.
            </Text>
          </View>
        </Page>
      </Document>
    </>
  )
}

export default InvoiceByIdPdf
