import { Switch, Redirect, withRouter } from 'react-router-dom';
import PublicRoute from '../commons/route/PublicRoute';
import PrivateRoute from '../commons/route/PrivateRoute';
import Header from './header/HeaderComponent';
import Footer from './footer/FooterComponent';
import Home from './home/HomeComponent';
import ProductList from './products/ProductListComponent';
import ProductDetail from './products/ProductDetailComponent';
import BookList from './books/BookListComponent';
import BookDetail from './books/BookDetailComponent';
import ProductSearch from './products/ProductSearchComponent';
import Cart from './cart/CartComponent';
import Checkout from './order/CheckoutComponent';
import OrderStatus from './order/OrderStatusComponent';

function Main(props) {
    return (
        <div>
            <Header />
                <Switch location={props.location}>
                    <PublicRoute path="/home" component={Home} />
                    <PublicRoute exact path="/products" component={ProductList} />
                    <PublicRoute path="/products/:id" component={ProductDetail} />
                    <PublicRoute exact path="/books" component={BookList} />
                    <PublicRoute path="/books/:id" component={BookDetail} />
                    <PublicRoute path="/search" component={ProductSearch} />
                    <PrivateRoute path="/cart" component={Cart} />
                    <PrivateRoute path="/checkout" component={Checkout} />
                    <PrivateRoute path="/orders" component={OrderStatus} />
                    <Redirect to="/home" />
                </Switch>
            <Footer />
        </div>
    );
}

export default withRouter(Main);