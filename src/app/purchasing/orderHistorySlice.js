import { createSlice } from '@reduxjs/toolkit';
import config from '../../config';
import { getAuthorizedHttpClient, getHttpClient } from '../commons/http/httpClient';

export const orderHistorySlice = createSlice({
    name: 'orderHistory',
    initialState: {
        history: [],
        isHistoryLoadingInprogress: true,
        historyLoadingErrMess: null,

        productsViews: [],
        isViewRefreshInprogress: true,
        viewRefreshErrMess: null,
    },
    reducers: {
        loadRequest: (state, action) => {
            return {
                ...state,
                history: [],
                isHistoryLoadingInprogress: true,
                historyLoadingErrMess: null,
            }
        },
        loadCompleted: (state, action) => {
            return {
                ...state,
                history: action.payload,
                isHistoryLoadingInprogress: false,
                historyLoadingErrMess: null,
            }
        },
        loadFailure: (state, action) => {
            return {
                ...state,
                history: [],
                isHistoryLoadingInprogress: false,
                historyLoadingErrMess: action.payload,
            }
        },

        viewRefreshRequest: (state, action) => {
            return {
                ...state,
                productsViews: [],
                isViewRefreshInprogress: true,
                viewRefreshErrMess: null
            }
        },
        viewRefreshCompleted: (state, action) => {
            return {
                ...state,
                productsViews: action.payload,
                isViewRefreshInprogress: false,
                viewRefreshErrMess: null
            }
        },
        viewRefreshFailure: (state, action) => {
            return {
                ...state,
                productsViews: state.productsViews,
                isViewRefreshInprogress: false,
                viewRefreshErrMess: action.payload
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const { loadRequest, loadCompleted, loadFailure, viewRefreshRequest, viewRefreshCompleted, viewRefreshFailure } = orderHistorySlice.actions

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const doLoadHistory = (completedCallback) => (dispatch) => {
    dispatch(loadRequest());

    const axiosInstance = getAuthorizedHttpClient(config.purchasingService);

    axiosInstance.get(config.purchasingService + '/orders/history')
        .then((response) => {
            let historyData = response.data.content;
            dispatch(doHistoryViewRefresh((refreshSuccess) => {
                if (refreshSuccess) {
                    dispatch(loadCompleted(historyData));
                    completedCallback?.(true);
                }
                else {
                    dispatch(loadFailure('could not refresh view'));
                    completedCallback?.(false);
                }
            }, historyData));
        })
        .catch((error) => {
            dispatch(loadFailure(error.message));
            completedCallback?.(false);
        });
};

export const doHistoryViewRefresh = (completedCallback, history) => (dispatch, getState) => {
    dispatch(viewRefreshRequest());

    let currentHistory = (history === undefined)? getState().orderHistory.history: history;

    let orderedProductIdSet = new Set();
    currentHistory.forEach( (order) => {
        let productsInOrder = order.entries.map((entry) => entry.productId);
        productsInOrder.forEach(productId => orderedProductIdSet.add(productId));
    });

    let orderedProductsPromises = [...orderedProductIdSet].map((productId) => {
        let axiosInstance = getHttpClient(config.inventoryService);
        return axiosInstance.get(config.inventoryService + '/products/' + productId);
    })

    let orderedProductsData = [];
    Promise.all(orderedProductsPromises)
        .then((productResponses) => {
            for (const productResponse of productResponses) {
                orderedProductsData[productResponse.data.id] = productResponse.data;
            }

            dispatch(viewRefreshCompleted(orderedProductsData));
            completedCallback?.(true);
        })
        .catch((error) => {
            dispatch(viewRefreshFailure(error.message));
            completedCallback?.(false);
        })
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectOrderHistoryState = state => state.orderHistory;

// Exporting the reducer
export default orderHistorySlice.reducer;