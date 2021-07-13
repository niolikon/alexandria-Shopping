import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../config';

export const inventoryFeaturedProductsSlice = createSlice({
    name: 'inventoryFeaturedProducts',
    initialState: {
        isLoadInprogress: true,
        results: [],
        errMess: null
    },
    reducers: {
        loadRequest: (state, action) => {
            return {
                ...state,
                isLoadInprogress: true,
                results: [],
                errMess: null
            }
        },
        loadCompleted: (state, action) => {
            return {
                ...state,
                isLoadInprogress: false,
                results: action.payload,
                errMess: null
            }
        },
        loadFailure: (state, action) => {
            return {
                ...state,
                isLoadInprogress: false,
                results: [],
                errMess: action.payload,
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const {loadRequest, loadCompleted, loadFailure} = inventoryFeaturedProductsSlice.actions

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const doLoadProducts = (completedCallback) => dispatch => {
    dispatch(loadRequest());

    axios.get(config.inventoryService + '/products/featured')
      .then((response) => {
        //   console.log(response);
          let searchResults = response.data.content;
        //   console.log('productsResponse:' + JSON.stringify(searchResults));
          dispatch(loadCompleted(searchResults));
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
export const selectFeaturedProductsState = state => state.inventoryFeaturedProducts;

// Exporting the reducer
export default inventoryFeaturedProductsSlice.reducer;