import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { selectProductDetailsState, doLoadProduct } from '../../inventory/inventoryProductDetailsSlice';
import { doCartAddItem } from '../../purchasing/shoppingCartSlice';
import config from '../../../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Typography } from '@material-ui/core';
import { selectAuthentication } from '../../authentication/authenticationSlice';
import BackButton from '../../commons/components/BackButtonComponent';
import SnackBar from '../../commons/components/SnackBarComponent';
import { Loader } from '../../commons/components/LoaderComponent';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 400,
    },
    media: {
        height: 200,
        maxWidth: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'block',
        [theme.breakpoints.down('xs')]: {
            height: 300,
        },
    },
    controls: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    name: {
        paddingLeft: theme.spacing(2),
        textAlign: 'justify',
        fontWeight: 'bold',
        fontSize: 'x-large',
        color: theme.palette.text.primary,
    },
    owners: {
        paddingLeft: theme.spacing(2),
        textAlign: 'justify',
        fontSize: 'large',
        color: theme.palette.text.primary,
    },
    description: {
        padding: theme.spacing(2),
        textAlign: 'justify',
        color: theme.palette.text.primary,
    },
    additional: {
        padding: theme.spacing(2),
        textAlign: 'left',
        color: theme.palette.text.primary,
    },
    actions: {
        display: 'flex',
        alignItems: 'center', 
        justifyContent: 'center'
    },
  }));

function ImagesCard(props) {
    const classes = useStyles();
    
    let images = props.images;
    if (images.length === 0) {
        images.push('/image-not-available.png');
    }
    const [imageIdx, setImageIdx] = useState(0);

    const handlePrevClick = () => {
        setImageIdx((imageIdx + images.length - 1) % images.length);
    }

    const handleNextClick = () => {
        setImageIdx((imageIdx + 1) % images.length);
    }

    return (
        <Card>
            <CardMedia
                className={classes.media}
                image={images[imageIdx]}
            />
            <Card>
                <div className={classes.controls}>
                    <IconButton 
                        aria-label="previous image"
                        onClick={handlePrevClick}
                        disabled={images.length < 2}
                    >
                        <ArrowLeftIcon />
                    </IconButton>
                    <IconButton 
                        aria-label="next image"
                        onClick={handleNextClick}
                        disabled={images.length < 2}
                    >
                        <ArrowRightIcon />
                    </IconButton>
                </div>
            </Card>
        </Card>
    );
}

function ProductView(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    const authenticationState = useSelector(selectAuthentication);

    const snackBar = useRef({});

    const product = props.product;
    const images = product.imageIds.map( (id) => { 
        return (config.inventoryService + '/images/' + id);
    });

    const handleAddToCart = (productId) => {
        dispatch(doCartAddItem(productId, (success) => {
            if (success) {
                snackBar.current.open("Item successfully added to cart!");
            }
            else {
                snackBar.current.error("Item could not be added to cart!");
            }
        }));
    }

    let isProductAvailable = (product.availability && product.availability > 0);
    let availabilityLabel = (isProductAvailable) ? (
        product.availability + ' available in stock'
    ) : (
        'Currently not available'
    );

    let addToCartButton = (isProductAvailable)? (
        <div className={classes.actions}>
            <Button variant="contained" onClick={() => handleAddToCart(product.id)} 
            disabled={authenticationState.isAuthenticated === false} color="primary">Add to cart</Button>
            <SnackBar reference={snackBar}></SnackBar>
        </div>
    ) : (
        <React.Fragment />
    );

    return (
        <React.Fragment>
            <div className="col-lg-2 col-md-3 col-sm-12">
                <ImagesCard images={images} />
            </div>
            <div className="col-lg-10 col-md-9 col-sm-12">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper variant="outlined">
                            <Typography className={classes.name}>{product.name}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper variant="outlined">
                            <Typography className={classes.description}>{product.description}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={8} md={10}>
                        <Typography className={classes.additional}>{availabilityLabel}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                        {addToCartButton}
                    </Grid>
                </Grid>
            </div>
        </React.Fragment>
    );

}

function ProductDetail(props) {

    let { id } = useParams();
  
    const dispatch = useDispatch();
    const detailsState = useSelector(selectProductDetailsState);

    useEffect(() => {
        dispatch(doLoadProduct(id));
    }, [dispatch, id]);

    return(
        <div className="container">
            <div className="row row-content">
                <Loader isLoading={detailsState.isLoadInprogress} errMess={detailsState.errMess}>
                    <ProductView product={detailsState.product} />
                </Loader>
            </div>
            <div className="row back-button-container">
                <BackButton></BackButton>
            </div>
        </div>
    );
}

export default ProductDetail;