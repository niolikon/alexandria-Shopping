import { createSlice } from '@reduxjs/toolkit';
import { Cart, Entry } from './model/cart';
import config from '../../config';
import { getAuthorizedHttpClient, getHttpClient } from '../commons/httpClient';

export const orderSlice = createSlice({
    name: 'order',
    initialState: {
        cart: Cart.EMPTY,
        isCartValid: false,

        shipmentAddress: {},
        isShipmentAddressValid: false,

        isOrderCreateInprogress: false,
        orderCreateErrMess: null
    },
    reducers: {
        setCartRequest: (state, action) => {
            return {
                ...state,
                cart: Cart.EMPTY,
                isCartValid: false,
            }
        },
        setCartSuccess: (state, action) => {
            return {
                ...state,
                cart: action.payload,
                isCartValid: true,
            }
        },

        setShipmentAddressRequest: (state, action) => {
            return {
                ...state,
                shipmentAddress: {},
                isShipmentAddressValid: true,
            }
        },
        setShipmentAddressSuccess: (state, action) => {
            return {
                ...state,
                shipmentAddress: action.payload,
                isShipmentAddressValid: true,
            }
        },

        orderCreateRequest: (state, action) => {
            return {
                ...state,
                isOrderCreateInprogress: true,
                orderCreateErrMess: null
            }
        },
        orderCreateCompleted: (state, action) => {
            return {
                ...state,
                isOrderCreateInprogress: false,
                orderCreateErrMess: null
            }
        },
        orderCreateFailure: (state, action) => {
            return {
                ...state,
                isOrderCreateInprogress: false,
                orderCreateErrMess: action.payload
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const { setCartRequest, setCartSuccess, setShipmentAddressRequest, setShipmentAddressSuccess,
    orderCreateRequest, orderCreateCompleted, orderCreateFailure } = orderSlice.actions

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const doOrderSetCart = (cart, completedCallback) => (dispatch) => {
    dispatch(setCartRequest());

    dispatch(setCartSuccess(cart));

    completedCallback?.(true);
};

export const doOrderSetShipmentAddress = (address, completedCallback) => (dispatch) => {
    dispatch(setShipmentAddressRequest());

    dispatch(setShipmentAddressSuccess(address));

    completedCallback?.(true);
};

export const doOrderCreate = (completedCallback) => (dispatch, getState) => {
    dispatch(orderCreateRequest());

    const currentCart = getState().order.cart;
    const currentShipmentAddress = getState().order.shipmentAddress;

    const axiosInstance = getAuthorizedHttpClient(config.purchasingService);
    let requestBody = {
        entries: currentCart.entries,
        address: currentShipmentAddress,
        status: "NEW"
    };

    axiosInstance.post(config.purchasingService + '/orders', requestBody)
        .then((response) => {
            console.log(response);
            dispatch(orderCreateCompleted(response.data));
            completedCallback?.(true);
        })
        .catch((error) => {
            dispatch(orderCreateFailure(error.message));
            completedCallback?.(false);
        });
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectOrderState = state => state.order;

// Exporting the reducer
export default orderSlice.reducer;