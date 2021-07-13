import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Header from './header/HeaderComponent';
import Footer from './footer/FooterComponent';
import Home from './home/HomeComponent';
import ProductDetail from './products/ProductDetailComponent';
import BookDetail from './books/BookDetailComponent';
import ProductSearch from './products/ProductSearchComponent';
import Cart from './cart/CartComponent';
import Checkout from './order/CheckoutComponent';

function Main(props) {
    return (
        <div>
            <Header />
                <Switch location={props.location}>
                    <Route path="/home" component={Home} />
                    <Route path="/products/:id" component={ProductDetail} />
                    <Route path="/books/:id" component={BookDetail} />
                    <Route path="/search" component={ProductSearch} />
                    <Route path="/cart" component={Cart} />
                    <Route path="/checkout" component={Checkout} />
                    <Redirect to="/home" />
                </Switch>
            <Footer />
        </div>
    );
}

export default withRouter(Main);