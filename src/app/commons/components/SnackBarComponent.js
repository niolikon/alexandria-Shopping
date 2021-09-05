import React, { useState } from "react";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SnackBar = (props) => {

    const [snackbarState, setSnackbarState] = useState({
        open: false,
        severity: "success",
        message: ""
    });

    const snackbarSuccess = (message) => {
        setSnackbarState({
            open: true,
            severity: "success",
            message: message
        });
    }

    const snackbarError = (message) => {
        setSnackbarState({
            open: true,
            severity: "error",
            message: message
        });
    }

    const snackbarClose = () => {
        setSnackbarState({
            ...snackbarState, 
            open: false
        });
    }

    const handleSnackbarClose = (event, reason) => {
        // if (reason === 'clickaway') {
        //     return;
        // }

        snackbarClose();
    };

    if (props.reference !== undefined) {
        props.reference.current.open = snackbarSuccess;
        props.reference.current.error = snackbarError;
        props.reference.current.close = snackbarClose;
    }

    return (
        <React.Fragment>
            <Snackbar open={snackbarState.open} autoHideDuration={5000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarState.severity}>
                    {snackbarState.message}
                </Alert>
            </Snackbar>
        </React.Fragment >
    );
};

export default SnackBar;