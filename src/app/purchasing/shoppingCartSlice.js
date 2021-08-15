import { createSlice } from '@reduxjs/toolkit';
import { Cart, Entry } from './model/cart';
import { CartView, EntryView } from './model/cartview';
import config from '../../config';
import { getAuthorizedHttpClient, getHttpClient } from '../commons/http/httpClient';

export const shoppingCartSlice = createSlice({
    name: 'shoppingCart',
    initialState: {
        cart: Cart.EMPTY,
        isLoadInprogress: true,
        loadErrMess: null,
        isUpdateInprogress: false,
        updateErrMess: null,

        cartView: CartView.EMPTY,
        isViewRefreshInprogress: true,
        viewRefreshErrMess: null,

        isBackendUpdateInprogress: false,
        backendUpdateErrMess: null
    },
    reducers: {
        loadRequest: (state, action) => {
            return {
                ...state,
                cart: Cart.EMPTY,
                isLoadInprogress: true,
                loadErrMess: null
            }
        },
        loadCompleted: (state, action) => {
            return {
                ...state,
                cart: action.payload,
                isLoadInprogress: false,
                loadErrMess: null
            }
        },
        loadFailure: (state, action) => {
            return {
                ...state,
                cart: Cart.EMPTY,
                isLoadInprogress: false,
                loadErrMess: action.payload
            }
        },

        clearRequest: (state, action) => {
            return {
                ...state,
                cart: state.cart,
                isLoadInprogress: state.isLoadInprogress,
                loadErrMess: null
            }
        },
        clearCompleted: (state, action) => {
            return {
                ...state,
                cart: action.payload,
                isLoadInprogress: true,
                loadErrMess: null
            }
        },

        updateRequest: (state, action) => {
            return {
                ...state,
                cart: state.cart,
                isUpdateInprogress: true,
                updateErrMess: null
            }
        },
        updateCompleted: (state, action) => {
            return {
                ...state,
                cart: action.payload,
                isUpdateInprogress: false,
                updateErrMess: null
            }
        },
        updateFailure: (state, action) => {
            return {
                ...state,
                cart: state.cart,
                isUpdateInprogress: false,
                updateErrMess: action.payload
            }
        },

        viewRefreshRequest: (state, action) => {
            return {
                ...state,
                cartView: CartView.EMPTY,
                isViewRefreshInprogress: true,
                viewRefreshErrMess: null
            }
        },
        viewRefreshCompleted: (state, action) => {
            return {
                ...state,
                cartView: action.payload,
                isViewRefreshInprogress: false,
                viewRefreshErrMess: null
            }
        },
        viewRefreshFailure: (state, action) => {
            return {
                ...state,
                cartView: state.cartView,
                isViewRefreshInprogress: false,
                viewRefreshErrMess: action.payload
            }
        },

        backendUpdateRequest: (state, action) => {
            return {
                ...state,
                isBackendUpdateInprogress: true,
                backendUpdateErrMess: null
            }
        },
        backendUpdateCompleted: (state, action) => {
            return {
                ...state,
                isBackendUpdateInprogress: false,
                backendUpdateErrMess: null
            }
        },
        backendUpdateFailure: (state, action) => {
            return {
                ...state,
                isBackendUpdateInprogress: false,
                backendUpdateErrMess: action.payload
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    loadRequest, loadCompleted, loadFailure,
    clearRequest, clearCompleted,
    updateRequest, updateCompleted, updateFailure,
    viewRefreshRequest, viewRefreshCompleted, viewRefreshFailure,
    backendUpdateRequest, backendUpdateCompleted, backendUpdateFailure
} = shoppingCartSlice.actions



// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched

export const doCartClear = (completedCallback) => dispatch => {
    dispatch(clearRequest());
    let clearedCart = Cart.EMPTY;
    dispatch(clearCompleted(clearedCart));
    completedCallback?.(true);
};

export const doCartLoad = (completedCallback) => dispatch => {
    dispatch(loadRequest());

    let axiosInstance = getAuthorizedHttpClient(config.purchasingService);
    axiosInstance.get(config.purchasingService + '/cart')
        .then((response) => {
            let responseCart = Cart.fromJSObject(response.data);
            dispatch(loadCompleted(responseCart.toJSObject()));

            dispatch(doCartViewRefresh((updateSuccess) => {
                if (updateSuccess) {
                    completedCallback?.(true);
                }
                else {
                    completedCallback?.(false);
                }
            }))
        })
        .catch((error) => {
            dispatch(loadFailure(error.message));
            completedCallback?.(false);
        })
};

export const doCartAddItem = (itemId, completedCallback) => (dispatch, getState) => {
    dispatch(updateRequest());

    const currentCart = getState().shoppingCart.cart;
    let updatedCart = Cart.fromJSObject(currentCart);
    updatedCart.addEntryById(itemId);

    const axiosInstance = getAuthorizedHttpClient(config.purchasingService);
    let requestBody = updatedCart.toJSObject();

    axiosInstance.put(config.purchasingService + '/cart', requestBody)
        .then((response) => {
            let responseCart = Cart.fromJSObject(response.data);
            let responseCartPlain = responseCart.toJSObject();
            dispatch(updateCompleted(responseCartPlain));

            dispatch(doCartBackendUpdate((updateSuccess) => {
                if (updateSuccess) {
                    dispatch(doCartViewRefresh((updateSuccess) => {
                        if (updateSuccess) {
                            completedCallback?.(true);
                        }
                        else {
                            completedCallback?.(false);
                        }
                    }))
                }
                else {
                    completedCallback?.(false);
                }
            }))
        })
        .catch((error) => {
            dispatch(updateFailure(error.message));
            completedCallback?.(false);
        });
};

export const doCartSetItemQuantity = (itemId, quantity, completedCallback) => (dispatch, getState) => {
    dispatch(updateRequest());

    const currentCart = getState().shoppingCart.cart;
    let updatedCart = Cart.fromJSObject(currentCart);
    let entry = updatedCart.getEntryById(itemId);

    if (quantity > 0) {
        entry.quantity = quantity;
        updatedCart.updateEntry(entry);
    } else {
        updatedCart.removeEntry(entry);
    }

    const axiosInstance = getAuthorizedHttpClient(config.purchasingService);
    let requestBody = updatedCart.toJSObject();

    axiosInstance.put(config.purchasingService + '/cart', requestBody)
        .then((response) => {
            let responseCart = Cart.fromJSObject(response.data);
            let responseCartPlain = responseCart.toJSObject();
            dispatch(updateCompleted(responseCartPlain));

            dispatch(doCartBackendUpdate((updateSuccess) => {
                if (updateSuccess) {
                    dispatch(doCartViewRefresh((updateSuccess) => {
                        if (updateSuccess) {
                            completedCallback?.(true);
                        }
                        else {
                            completedCallback?.(false);
                        }
                    }))
                }
                else {
                    completedCallback?.(false);
                }
            }))
        })
        .catch((error) => {
            dispatch(updateFailure(error.message));
            completedCallback?.(false);
        });
};

export const doCartReset = (completedCallback) => (dispatch) => {
    dispatch(updateRequest());

    let updatedCart = Cart.EMPTY;

    const axiosInstance = getAuthorizedHttpClient(config.purchasingService);
    let requestBody = updatedCart;

    axiosInstance.put(config.purchasingService + '/cart', requestBody)
        .then((response) => {
            let responseCart = Cart.fromJSObject(response.data);
            let responseCartPlain = responseCart.toJSObject();
            dispatch(updateCompleted(responseCartPlain));

            dispatch(doCartBackendUpdate((updateSuccess) => {
                if (updateSuccess) {
                    dispatch(doCartViewRefresh((updateSuccess) => {
                        if (updateSuccess) {
                            completedCallback?.(true);
                        }
                        else {
                            completedCallback?.(false);
                        }
                    }))
                }
                else {
                    completedCallback?.(false);
                }
            }))
        })
        .catch((error) => {
            dispatch(updateFailure(error.message));
            completedCallback?.(false);
        });
};

export const doCartViewRefresh = (completedCallback) => (dispatch, getState) => {
    dispatch(viewRefreshRequest());

    let cartData = getState().shoppingCart.cart;

    let cartEntriesProductIdMap = []
    for (const entry of cartData.entries) {
        cartEntriesProductIdMap[entry.productId] = entry;
    }

    let cartEntryProductDataPromises = cartData.entries.map((entry) => {
        let axiosInstance = getHttpClient(config.inventoryService);
        return axiosInstance.get(config.inventoryService + '/products/' + entry.productId);
    })

    let cartViewData = new CartView([]);
    Promise.all(cartEntryProductDataPromises)
        .then((productResponses) => {
            for (const productResponse of productResponses) {
                let entry = cartEntriesProductIdMap[productResponse.data.id];
                let entryView = new EntryView(productResponse.data, entry.quantity);

                cartViewData.append(entryView);
            }

            dispatch(viewRefreshCompleted(cartViewData.toJSObject()));
            completedCallback?.(true);
        })
        .catch((error) => {
            dispatch(viewRefreshFailure(error.message));
            completedCallback?.(false);
        })
};

export const doCartBackendUpdate = (completedCallback) => (dispatch, getState) => {
    dispatch(backendUpdateRequest());

    let cartData = getState().shoppingCart.cart;

    const axiosInstance = getAuthorizedHttpClient(config.purchasingService);
    let requestBody = cartData;

    axiosInstance.put(config.purchasingService + '/cart', requestBody)
        .then((response) => {
            let responseCart = response.data;
            dispatch(backendUpdateCompleted(responseCart));
            completedCallback?.(true);
        })
        .catch((error) => {
            dispatch(backendUpdateFailure(error.message));
            completedCallback?.(false);
        });
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectCartState = state => state.shoppingCart;

// Exporting the reducer
export default shoppingCartSlice.reducer;