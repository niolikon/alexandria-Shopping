import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Carousel from "react-material-ui-carousel";
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    Button,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSelector, useDispatch } from 'react-redux';
import { doLoadBooks, selectFeaturedBooksState } from '../../inventory/inventoryFeaturedBooksSlice';
import { doLoadProducts, selectFeaturedProductsState } from '../../inventory/inventoryFeaturedProductsSlice';
import './style/FeaturedCarousel.scss';
import config from '../../../config';

function CarouselSlide(props) {
    const history = useHistory();
    const contentPosition = props.item.ContentPosition ? props.item.ContentPosition : "left";

    const slideDataIsLoading = props.item.ContentState.isLoadInprogress;
    const slideDataResults = props.item.ContentState.results;
    const slideDataErrMess = props.item.ContentState.errMess;

    const totalItems = 3;
    const mediaLength = totalItems - 1;

    let viewNowRoute = '/products';
    switch(props.item.ContentCategory) {
        case 'books':
            viewNowRoute = '/books';
            break;
            
        case 'products':
        default:
            viewNowRoute = '/products';
            break;

    }

    const content = (
        <Grid item xs={12 / totalItems} key="content">
            <CardContent className="Content">
                <Typography className="Title">
                    {props.item.Name}
                </Typography>

                <Typography className="Caption">
                    {props.item.Caption}
                </Typography>

                <Button variant="outlined" className="ViewButton" onClick={ () => {history.push(viewNowRoute)}}>
                    View Now
                </Button>
            </CardContent>
        </Grid>
    )

    let slideItems = [];
    for (let i = 0; i < mediaLength; i++) {
        let media = null;

        if (slideDataIsLoading) 
        {
            media = (
                <Grid item xs={12 / totalItems} key={i}>
                    <CircularProgress />
                </Grid>
            );
        }
        else if (slideDataErrMess != null) 
        {
            media = (
                <Grid item xs={12 / totalItems} key={i}>
                    <CardMedia
                        className="Media"
                        title="Errir"
                    >
                        <Typography className="MediaCaption">
                            {slideDataErrMess}
                        </Typography>
                    </CardMedia>
                </Grid>
            );
        }
        else 
        {
            let item = slideDataResults[i];
            let itemGridId = props.item.ContentCategory + item.id;
            let itemImage = (item.imageIds.length > 0)? (config.inventoryService + '/images/' + item.imageIds[0]) : '';

            let itemName = '';
            let itemLink = '#';
            switch(props.item.ContentCategory) {
                case 'books':
                    itemName = item.title;
                    itemLink = '/books/' + item.id;
                    break;
                    
                case 'products':
                default:
                    itemName = item.name;
                    itemLink = '/products/' + item.id;
                    break;

            }
            itemName = (itemName.length > 25)? itemName.substring(0, 25) + '...' : itemName;
    
            media = (
                <Grid item xs={12 / totalItems} key={itemGridId}>
                    <CardMedia
                        className="Media"
                        image={itemImage}
                        title={itemName}
                    >
                        <Typography className="MediaCaption">
                            <Link component={RouterLink} to={itemLink}>
                                {itemName}
                            </Link>
                        </Typography>
                    </CardMedia>
                </Grid>
            );
        }
    
        slideItems.push(media);
    }

    if (contentPosition === "left") {
        slideItems.unshift(content);
    } else if (contentPosition === "right") {
        slideItems.push(content);
    } else if (contentPosition === "middle") {
        slideItems.splice(slideItems.length / 2, 0, content);
    }

    return (
        <Card raised className="Banner">
            <Grid container spacing={0} className="BannerGrid">
                {slideItems}
            </Grid>
        </Card>
    )
}

function FeaturedCarousel(props) {

    const [autoPlay, ] = useState(true);
    const [animation, ] = useState('slide');
    const [indicators, ] = useState(true);
    const [timeout, ] = useState(500);
    const [navButtonsAlwaysVisible, ] = useState(false);
    const [navButtonsAlwaysInvisible, ] = useState(false);
    const [cycleNavigation, ] = useState(true);

    const dispatch = useDispatch();
    const featuredBooksState = useSelector(selectFeaturedBooksState);
    const featuredProductsState = useSelector(selectFeaturedProductsState);

    useEffect(() => {
        dispatch(doLoadBooks());
        dispatch(doLoadProducts());
    }, [dispatch]);

    let carouselSlides = [
        {
            Title: 'Products',
            Caption: 'Products for everyday use',
            ContentPosition: 'left',
            ContentCategory: 'products',
            ContentState: featuredProductsState
        },
        {
            Title: 'Books',
            Caption: 'Books that everyone should read made cheap',
            ContentPosition: 'middle',
            ContentCategory: 'books',
            ContentState: featuredBooksState
        },
    ];

    return (
            <Carousel
                className="Example"
                autoPlay={autoPlay}
                animation={animation}
                indicators={indicators}
                timeout={timeout}
                cycleNavigation={cycleNavigation}
                navButtonsAlwaysVisible={navButtonsAlwaysVisible}
                navButtonsAlwaysInvisible={navButtonsAlwaysInvisible}
            >
                {
                    carouselSlides.map((slide, index) => {
                        return <CarouselSlide item={slide} key={index}/>
                    })
                }
            </Carousel>

    )
}

export default FeaturedCarousel;