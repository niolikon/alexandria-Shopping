import { useState } from 'react';
import InputBase from '@material-ui/core/InputBase';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { doSearch } from '../../inventory/inventorySearchSlice';

export default function SearchComponent(props) {

    const [searchKey, setSearchKey] = useState('');

    const dispatch = useDispatch();
    const history = useHistory();

    const onSubmitHandler = (event) => {
        event.preventDefault();
        
        if (searchKey.length > 0) {
            dispatch(doSearch(searchKey));
            history.push('/search');
        } else {
            history.push('/home');
        }
    };

    return (
        <form onSubmit={onSubmitHandler}>
            <InputBase
                placeholder="Search…"
                classes={props.classes}
                inputProps={props.inputProps}
                value={searchKey}
                onChange={(event) => setSearchKey(event.target.value)}
            />
        </form>
    );
}