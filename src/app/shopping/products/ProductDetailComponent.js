import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
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

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 400,
    },
    media: {
        height: 200,
    },
    controls: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    name: {
        padding: theme.spacing(2),
        textAlign: 'justify',
        fontWeight: 'bold',
        fontSize: 'large',
        color: theme.palette.text.primary,
    },
    owners: {
        padding: theme.spacing(2),
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
    let imageIdx = 0;

    const handlePrevClick = () => {
        imageIdx = (imageIdx + images.length - 1) % images.length;
    }

    const handleNextClick = () => {
        imageIdx = (imageIdx + 1) % images.length;
    }

    if (images.length === 0) {
        images.push('/image-not-available.png');
        imageIdx = 0;
    }

    return (
        <Card className={classes.root}>
            <CardMedia
                className={classes.media}
                image={images[imageIdx]}
            />
            <Card>
                <div className={classes.controls}>
                    <IconButton 
                        aria-label="previous image"
                        onClick={handlePrevClick}
                    >
                        <ArrowLeftIcon />
                    </IconButton>
                    <IconButton 
                        aria-label="next image"
                        onClick={handleNextClick}
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

    const product = props.product;
    const images = product.imageIds.map( (id) => { 
        return (config.inventoryService + '/images/' + id);
    });

    const handleAddToCart = (productId) => {
        dispatch(doCartAddItem(productId, () => {}));
    }

    let isAvailable = (product.availability && product.availability > 0);
    let availabilityLabel = (isAvailable) ? (
        product.availability + ' available in stock'
    ) : (
        'Currently not available'
    );

    let addToCartButton = (isAvailable)? (
        <div className={classes.actions}>
            <Button variant="contained" onClick={() => handleAddToCart(product.id)} color="primary">Add to cart</Button>
        </div>
    ) : (
        <React.Fragment />
    );

    return (
        <React.Fragment>
            <div className="col-2">
                <ImagesCard images={images} />
            </div>
            <div className="col-10">
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
                    <Grid item xs={12} sm={6}>
                        <Typography className={classes.additional}>{availabilityLabel}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {addToCartButton}
                    </Grid>
                </Grid>
            </div>
        </React.Fragment>
    );

}

function ProductLoader(props) {
    let detailsState = props.loaderState;

    if (detailsState.isLoadInprogress) {
        return (
            <div className="col">
                <CircularProgress />
            </div>
        );
    }
    else if (detailsState.errMess) {
        return (
            <div className="col">
                <h2>{detailsState.errMess}</h2>
            </div>
        );
    }
    else {
        return (
            <React.Fragment>
                {props.children}
            </React.Fragment>
        );
    };
}

function ProductDetail(props) {

    let { id } = useParams();
  
    const dispatch = useDispatch();
    const detailsState = useSelector(selectProductDetailsState);

    useEffect(() => {
        dispatch(doLoadProduct(id));
    }, []);

    return(
        <div className="container">
            <div className="row">
                <div className="col">
            Product details is working!
                </div>
            </div>
                
            <div className="row row-content">
                <ProductLoader loaderState={detailsState}>
                    <ProductView product={detailsState.product}/>
                </ProductLoader>
            </div>
        </div>
    );
}

export default ProductDetail;