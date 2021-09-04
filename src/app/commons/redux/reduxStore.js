import { configureStore } from '@reduxjs/toolkit';
import { reducer as formReducer } from 'redux-form';
import authenticationReducer from '../../authentication/authenticationSlice';
import inventorySearchSlice from '../../inventory/inventorySearchSlice';
import inventoryBookSearchSlice from '../../inventory/inventoryBookSearchSlice';
import inventoryFeaturedBooksSlice from '../../inventory/inventoryFeaturedBooksSlice';
import inventoryFeaturedProductsSlice from '../../inventory/inventoryFeaturedProductsSlice';
import inventoryBooksDetailsSlice from '../../inventory/inventoryBookDetailsSlice';
import inventoryProductDetailsSlice from '../../inventory/inventoryProductDetailsSlice';
import shoppingCartSlice from '../../purchasing/shoppingCartSlice';
import orderSlice from '../../purchasing/orderSlice';
import orderHistorySlice from '../../purchasing/orderHistorySlice';

export default configureStore({
  reducer: {
    authentication: authenticationReducer,
    inventorySearch: inventorySearchSlice,
    inventoryBookSearch: inventoryBookSearchSlice,
    inventoryFeaturedBooks: inventoryFeaturedBooksSlice,
    inventoryFeaturedProducts: inventoryFeaturedProductsSlice,
    inventoryBookDetails: inventoryBooksDetailsSlice,
    inventoryProductDetails: inventoryProductDetailsSlice,
    shoppingCart: shoppingCartSlice,
    order: orderSlice,
    orderHistory: orderHistorySlice,
    form: formReducer
  },
})