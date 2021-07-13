import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import config from '../../../config';

const useStyles = makeStyles((theme) => ({}));

function SummaryCartView({cartView}) {
    const classes = useStyles();

    const localTaxes = config.taxes;
    
    const formatAmount = (money) => {
        return `${money.toFixed(2)}`;
    }

    const subTotal = (aCartView) => {
        let subTotal = 0;
        for(let entry of aCartView.entries) {
            subTotal += entry.quantity * entry.productData.price;
        }

        return subTotal;
    }

    let invoiceSubtotal = subTotal(cartView);
    let invoiceTaxes = invoiceSubtotal * (localTaxes/100.0);
    let invoiceTotal = invoiceSubtotal + invoiceTaxes;

    return (
        <TableContainer component={Paper}>
          <Table aria-label="spanning table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={3}>
                  Product Details
                </TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Description</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Sum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartView.entries.map((entry) => (
                <TableRow key={entry.productData.id}>
                  <TableCell colSpan={2}>{entry.productData.name}</TableCell>
                  <TableCell align="right">{entry.quantity}</TableCell>
                  <TableCell align="right">{formatAmount(entry.productData.price)}</TableCell>
                </TableRow>
              ))}
    
              <TableRow>
                <TableCell rowSpan={3}/>
                <TableCell colSpan={2}>Subtotal</TableCell>
                <TableCell align="right">{formatAmount(invoiceSubtotal)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tax</TableCell>
                <TableCell align="right">{localTaxes} &#37;</TableCell>
                <TableCell align="right">{formatAmount(invoiceTaxes)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell align="right">{formatAmount(invoiceTotal)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      );
}

export default SummaryCartView;