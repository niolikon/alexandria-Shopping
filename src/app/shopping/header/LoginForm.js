import Button from '@material-ui/core/Button';
import { renderTextField } from '../../commons/redux/reduxFormFieldRenderers';
import { Field, reduxForm } from 'redux-form';

let LoginFormComponent = props => {
    const { handleSubmit, pristine, submitting, valid } = props;
    let isInvalid = !valid;

    return (
        <form onSubmit={handleSubmit}>
            <Field name="username" component={renderTextField} label="Enter your Username here" fullWidth />
            <Field name="password" component={renderTextField} label="Enter your Password here" type="password" fullWidth />
            <Button
                type="submit" variant="contained" color="primary" disabled={pristine || submitting || isInvalid} >
                Submit
            </Button>
        </form>
    )
};

const validate = values => {
    const errors = {}
    
    if (!values.username) {
        errors.username = 'Required';
    } else if (values.username.length < 2) {
        errors.username = 'Must be at least 2 characters long';
    }

    if (!values.password) {
        errors.password = 'Required';
    } else if (values.password.length < 2) {
        errors.password = 'Must be at least 2 characters long';
    }

    return errors;
}

// Decorate with redux-form
LoginFormComponent = reduxForm({
    form: 'loginForm',
    validate,
})(LoginFormComponent)

export default LoginFormComponent;