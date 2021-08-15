import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { Fade, Stagger } from 'react-animation-components';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Loader } from '../../commons/components/LoaderComponent';
import { selectOrderHistoryState, doLoadHistory } from '../../purchasing/orderHistorySlice';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        marginBottom: '20px'
    },
    statusCell: {
        marginBottom: '20px'
    }
}));

function SummaryEntriesView({ order }) {
    const orderHistoryState = useSelector(selectOrderHistoryState);
    const orderProductsView = orderHistoryState.productsViews;

    return (
        <TableContainer component={Paper}>
            <Table aria-label="spanning table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Items ordered</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {order.entries.map((entry) => (
                        <TableRow key={entry.productId}>
                            <TableCell align="center">{orderProductsView[entry.productId].name} &times; {entry.quantity}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function OrderItem({ order }) {
    const classes = useStyles();

    return (
        <Paper className={classes.paper}>
            <Grid container direction="row">
                <Grid item sm={6}>
                    <Typography variant="subtitle2">
                        ID: {order.id}
                    </Typography>
                </Grid>
                <Grid item sm={6}>
                    <Typography variant="subtitle2" align="right" className={classes.statusCell}>
                        Status: {order.status}
                    </Typography>
                </Grid>
                <Grid item sm={8} container direction="row" spacing={2}>
                    <Grid item>
                        <Typography variant="h4" gutterBottom>
                            {order.address.name}&nbsp;{order.address.surname}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            {order.address.address}&nbsp;{order.address.city}&nbsp;{order.address.zip}&nbsp;{order.address.state}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            E-mail: {order.address.email} Tel: {order.address.telephone}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item sm={4} container direction="column" spacing={2}>
                    <SummaryEntriesView order={order} />
                </Grid>
            </Grid>
        </Paper>
    );
}


function OrderStatus(props) {
    const orderHistoryState = useSelector(selectOrderHistoryState);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(doLoadHistory());
    }, [])


    let orderHistory = orderHistoryState.history.map((order) => {
        return (
            <Fade in key={order.id}>
                <div className="col-12 mt-2">
                    <OrderItem order={order} />
                </div>
            </Fade>
        );
    });

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    Order status working!
                </div>
            </div>

            <div className="row justify-contents-start">
                <div className="col-12">
                    <Loader isLoading={orderHistoryState.isHistoryLoadingInprogress} errMess={orderHistoryState.historyLoadingErrMess}>
                        {orderHistory}
                    </Loader>
                </div>
            </div>
        </div>
    );
}

export default OrderStatus;