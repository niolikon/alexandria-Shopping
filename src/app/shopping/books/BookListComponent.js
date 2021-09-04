import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { Fade, Stagger } from 'react-animation-components';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import config from '../../../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Media } from 'reactstrap';
import { selectAuthentication } from '../../authentication/authenticationSlice';
import { doCartAddItem } from '../../purchasing/shoppingCartSlice';
import { doBookSearch, selectBookSearchState } from '../../inventory/inventoryBookSearchSlice';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      margin: 'auto',
    },
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

function BookItem({book}) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const authenticationState = useSelector(selectAuthentication);

    let imageSrc = (book.imageIds.length > 0)? config.inventoryService + '/images/' + book.imageIds[0]: '';
    let imageAlt = 'Product ' + book.id;

    const handleAddToCart = (bookId) => {
        dispatch(doCartAddItem(bookId, () => {}));
    }

    const handleGoToBook = (book) => {
        history.push('/books/' + book.id);
    }

    return (
        <Paper className={classes.paper}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={3} md={2}>
                    <ButtonBase className={classes.imageButton} onClick={() => handleGoToBook(book)}>
                        <img className={classes.imagePicture} alt={imageAlt} src={imageSrc} />
                    </ButtonBase>
                </Grid>
                <Grid item xs={12} sm={6} md={8} container>
                    <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                            <Typography gutterBottom variant="subtitle1">
                                {book.title}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {book.synopsis}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                ID: {book.id}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={3} md={2}>
                    <Grid item xs container direction="column" justifyContent="space-around" alignItems="center" spacing={2}>
                        <Grid item xs={12} sm>
                            <Typography variant="subtitle1">{book.price}&nbsp;&euro;</Typography>
                        </Grid>
                        <Grid item xs={12} sm>
                            <Button variant="contained" color="primary" onClick={() => handleAddToCart(book.id)}
                                disabled={authenticationState.isAuthenticated === false}>
                                Add to cart
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}

function ResultLoader(props) {
    let searchState = props.loaderState;

    if (searchState.isSearchInprogress) {
        return (
            <CircularProgress />
        );
    }
    else if (searchState.errMess) {
        return (
            <h2>{searchState.errMess}</h2>
        );
    }
    else {
        return (
            <Media list>
                <Stagger in>
                    {props.children}
                </Stagger>
            </Media>
        );
    };
}

function ProductSearch(props) {
    
    const searchState = useSelector(selectBookSearchState);
    const dispatch = useDispatch();
    
    useEffect( () => {
        dispatch(doBookSearch());
    }, [dispatch]);
    
    let searchResults = searchState.search.results.map((book) => {
        return (
            <Fade in key={book.id}>
                <div className="col-12 mt-2">
                    <BookItem book={book} />
                </div>
            </Fade>
        );
    });

    let pageContents = (searchState.isSearchRequested)? (
        <ResultLoader loaderState={searchState}>
            {searchResults}
        </ResultLoader>
    ) : (
        <h4>No search specified</h4>
    );

    return(
        <div className="container">
            <div className="row justify-contents-start">
                <div className="col-12">
                    {pageContents}
                </div>
            </div>
        </div>
    );
}

export default ProductSearch;