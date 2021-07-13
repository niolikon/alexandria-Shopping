import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../config';

export const inventoryProductDetailsSlice = createSlice({
    name: 'inventoryProductDetails',
    initialState: {
        isLoadInprogress: true,
        product: null,
        errMess: null
    },
    reducers: {
        loadRequest: (state, action) => {
            return {
                ...state,
                isLoadInprogress: true,
                product: null,
                errMess: null
            }
        },
        loadCompleted: (state, action) => {
            return {
                ...state,
                isLoadInprogress: false,
                product: action.payload,
                errMess: null
            }
        },
        loadFailure: (state, action) => {
            return {
                ...state,
                isLoadInprogress: false,
                product: null,
                errMess: action.payload,
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const {loadRequest, loadCompleted, loadFailure} = inventoryProductDetailsSlice.actions

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const doLoadProduct = (productId, completedCallback) => dispatch => {
    dispatch(loadRequest());

    axios.get(config.inventoryService + '/products/' + productId)
      .then((response) => {
          let productDetails = response.data;
        //   console.log('bookDetails:' + JSON.stringify(bookDetails));
          dispatch(loadCompleted(productDetails));
          completedCallback?.(true);
        //   if (authResponse.success) {
        //     let systemCredentials = {username: loginData.username, token: response.data.token};
        //     localStorage.setItem(CREDENTIALS_ITEMNAME, JSON.stringify(systemCredentials));
            
        //     dispatch(loginSuccess(systemCredentials));
        //     completedCallback(true);
        //   } else {
        //     dispatch(loginFailure(authResponse.err))
        //     completedCallback(false);
        //   }
      })
      .catch((error) => {
        dispatch(loadFailure(error.message));
        completedCallback?.(false);
      });
  };

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectProductDetailsState = state => state.inventoryProductDetails;

// Exporting the reducer
export default inventoryProductDetailsSlice.reducer;