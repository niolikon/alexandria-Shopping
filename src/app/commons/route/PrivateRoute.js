import { useDispatch, useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { selectAuthentication, doCheckCredentials } from '../../authentication/authenticationSlice';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const authentication = useSelector(selectAuthentication);

  const dispatch = useDispatch();
  const credentialsCheck = () => { dispatch(doCheckCredentials()) };

  return (
    <Route onEnter={credentialsCheck} {...rest} render={(props) => (
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

