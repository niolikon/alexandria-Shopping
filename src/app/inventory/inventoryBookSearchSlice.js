import { createSlice } from '@reduxjs/toolkit';
import { Search } from './model/search';
import axios from 'axios';
import config from '../../config';

export const inventoryBookSearchSlice = createSlice({
    name: 'inventoryBookSearch',
    initialState: {
        search: Search.EMPTY,
        isSearchRequested: false,
        isSearchInprogress: false,
        errMess: null
    },
    reducers: {
        searchClear: (state, action) => {
            return {
                ...state,
                search: Search.EMPTY,
                isSearchRequested: false,
                isSearchInprogress: false,
                errMess: null
            }
        },
        searchRequest: (state, action) => {
            let updatedSearch = {
                key: action.payload, 
                results: [], 
                isNew: false
            };

            return {
                ...state,
                search: updatedSearch,
                isSearchRequested: true,
                isSearchInprogress: true,
                errMess: null
            }
        },
        searchCompleted: (state, action) => {
            let updatedSearch = {
                key: state.search.key, 
                results: action.payload, 
                isNew: false
            };

            return {
                ...state,
                search: updatedSearch,
                isSearchRequested: true,
                isSearchInprogress: false,
                errMess: null
            }
        },
        searchFailure: (state, action) => {
            let updatedSearch = Search.EMPTY;

            return {
                ...state,
                search: updatedSearch,
                isSearchRequested: true,
                isSearchInprogress: false,
                errMess: action.payload,
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const {searchClear, searchRequest, searchCompleted, searchFailure} = inventoryBookSearchSlice.actions

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const doBookSearch = (searchKey, completedCallback) => dispatch => {
    dispatch(searchRequest(searchKey));

    axios.get(config.inventoryService + '/books', {
        params: {
            search: searchKey
        }
    })
      .then((response) => {
        //   console.log(response);
          let searchResults = response.data.content;
          dispatch(searchCompleted(searchResults));
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
        dispatch(searchFailure(error.message));
        completedCallback?.(false);
      });
  };

export const doBookSearchClear = (completedCallback) => dispatch => {
    dispatch(searchClear());

    completedCallback?.(true);
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectBookSearchState = state => state.inventoryBookSearch;

// Exporting the reducer
export default inventoryBookSearchSlice.reducer;