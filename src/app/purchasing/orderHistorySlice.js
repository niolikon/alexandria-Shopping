import { createSlice } from '@reduxjs/toolkit';
import config from '../../config';
import { getAuthorizedHttpClient } from '../commons/http/httpClient';

export const orderHistorySlice = createSlice({
    name: 'orderHistory',
    initialState: {
        history: [],
        
        isHistoryLoadingInprogress: true,
        historyLoadingErrMess: null
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
    },
})

// Action creators are generated for each case reducer function
export const { loadRequest, loadCompleted, loadFailure } = orderHistorySlice.actions

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const doLoadHistory = (completedCallback) => (dispatch) => {
    dispatch(loadRequest());

    const axiosInstance = getAuthorizedHttpClient(config.purchasingService);

    axiosInstance.get(config.purchasingService + '/orders/history')
        .then((response) => {
            dispatch(loadCompleted(response.data.content));
            completedCallback?.(true);
        })
        .catch((error) => {
            dispatch(loadFailure(error.message));
            completedCallback?.(false);
        });
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectOrderHistoryState = state => state.orderHistory;

// Exporting the reducer
export default orderHistorySlice.reducer;