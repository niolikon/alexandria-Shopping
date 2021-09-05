import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { selectAuthentication, doCheckCredentials } from '../../authentication/authenticationSlice';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const authentication = useSelector(selectAuthentication);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(doCheckCredentials())
  }, [dispatch, authentication.credentials]);

  return (
    <Route {...rest} render={(props) => (
      authentication.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect to={{
          pathname: '/home',
          state: { from: props.location }
        }}
        />
      )
    )} />
  )
}

export default PrivateRoute;

