import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { doLoadReferencedProducts, selectCartState } from '../../purchasing/shoppingCartSlice';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Loader } from '../../commons/components/LoaderComponent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import config from '../../../config';

const useStyles = makeStyles((theme) => ({
    imageButton: {
      width: 128,
      height: 128,
    },
    imagePicture: {
      margin: 'auto',
      display: 'block',
      maxWidth: '100%',
      maxHeight: '100%',
    },
}));

function EntryView({entry}) {
    const classes = useStyles();

    const product = entry.productData;
    let imageSrc = (product.imageIds.length > 0)? config.inventoryService + '/images/' + product.imageIds[0]: '';
    let imageAlt = 'Product ' + product.id;

    return (
        <Grid item container xs direction="row">
            <Grid item xs={12} sm={3} md={2}>
                <ButtonBase className={classes.imageButton}>
                    <img className={classes.imagePicture} alt={imageAlt} src={imageSrc} />
                </ButtonBase>
            </Grid>
            <Grid item xs={12} sm={9} md={10}>
                <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                        <Typography gutterBottom variant="subtitle1">
                            {product.name}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            {product.description}
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="body2" color="textSecondary">
                            {product.price}&nbsp;&euro; &times; {entry.quantity}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}


function BillView({cart}) {
    const classes = useStyles();
    const history = useHistory();

    const handlePlaceOrder = (cart) => {
        history.push('/checkout');
    }

    let subTotal = 0;
    let entryCount = 0;

    for (const entry of cart.entries) {
        subTotal += entry.productData.price * entry.quantity;
        entryCount += entry.quantity;
    }

    if (entryCount > 0) {
        return (
            <Grid container direction="column">
                <Grid item xs={12} sm={3} md={2}>
                    <Typography gutterBottom variant="subtitle1">
                        Subtotal&nbsp;({entryCount}&nbsp;items): {subTotal}&nbsp;&euro; 
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={9} md={10}>
                    <Button variant="contained" color="primary" onClick={() => handlePlaceOrder(cart)}>
                        Checkout order
                    </Button>
                </Grid>
            </Grid>
        );
    }
    else {
        return (
            <Grid container direction="column">
                <Grid item xs={12} sm={3} md={2}>
                    <Typography gutterBottom variant="subtitle1">
                        Cart&nbsp;is&nbsp;empty
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={9} md={10}>
                    <Button variant="contained" color="primary" disabled={true}>
                        Checkout order
                    </Button>
                </Grid>
            </Grid>
        );
    }

}

function Cart(props) {
    const cartState = useSelector(selectCartState);
    const cartView = cartState.cartView;
    
    let cartViewHasEntries = (cartView.entries !== undefined && (cartView.entries.length > 0));

    let cartEntrieViews = cartState.cartView.entries.map((entry) => {
        return (
            <EntryView key={entry.productData.id} entry={entry} />
        );
    });

    let cartEntryViewsPanel = (cartViewHasEntries) ? (
        <Grid container spacing={2} direction="column">
            <Grid item>
                {cartEntrieViews}
            </Grid>
        </Grid>
    ) : (
        <h2>Cart is empty</h2>
    );

    let cartBillViewPanel = (cartViewHasEntries) ? (
        <BillView cart={cartState.cartView}></BillView>
    ) : (
        <React.Fragment />
    );
    return(
        <div className="container">
            <div className="row">
                <div className="col">
                    <h2>Cart</h2>
                    <hr/>
                </div>
            </div>
            <div className="row row-content">
                <div className="col-12 col-sm-10">
                    <Loader isLoading={cartState.isViewRefreshInprogress} errMess={cartState.viewRefreshErrMess}>
                        {cartEntryViewsPanel}
                    </Loader>
                </div>
                <div className="col-12 col-sm-2">
                    <Loader isLoading={cartState.isViewRefreshInprogress} errMess={cartState.viewRefreshErrMess}>
                        {cartBillViewPanel}
                    </Loader>
                </div>
            </div>
        </div>
    );
}

export default Cart;