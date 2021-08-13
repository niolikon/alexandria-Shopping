import React from 'react';
import { useDispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { doCheckCredentials } from '../../authentication/authenticationSlice';

const PublicRoute = ({ component: Component, ...rest }) => {
    const dispatch = useDispatch();
    const credentialsCheck = () => { dispatch(doCheckCredentials()) };

    return (
        <Route onEnter={credentialsCheck} {...rest} render={
            props => <Component {...rest} {...props} />
        } />
    )
}

export default PublicRoute;