import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export function Loader(props) {

    let spinnerSize = (props.spinnerSize)? props.spinnerSize : 120;

    if (props.isLoading) {
        return (
            <CircularProgress size={spinnerSize}/>
        );
    }
    else if (props.errMess) {
        return (
            <h2>{props.errMess}</h2>
        );
    }
    else {
        return (
            <React.Fragment>
                {props.children}
            </React.Fragment>
        );
    };
}