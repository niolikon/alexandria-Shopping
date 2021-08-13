import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { renderTextField } from '../../commons/redux/reduxFormFieldRenderers';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector, isValid } from 'redux-form';

const useStyles = makeStyles((theme) => ({
    button: {
        marginRight: theme.spacing(1),
    },
    submitButton: {
      marginTop: 20,
    },
}));

let ShipmentForm = props => {
    const classes = useStyles();

    const { handleSubmit, pristine, reset, submitting, valid } = props;
    let isInvalid = !valid;

    return (
        <form onSubmit={handleSubmit}>
            <Grid container direction="row">
                <Grid item xs={12} sm={6}>
                    Name:&nbsp;<Field name="name" component={renderTextField} label="Enter your Name here" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    Surname:&nbsp;<Field name="surname" component={renderTextField} label="Enter your Surname here" fullWidth />
                </Grid>

                <Grid item xs={12}>
                    Address:&nbsp;<Field name="address" component={renderTextField} label="Enter your Address here" fullWidth />
                </Grid>

                <Grid item xs={12} sm={4}>
                    City:&nbsp;<Field name="city" component={renderTextField} label="Enter your City here" fullWidth />
                </Grid>
                <Grid item xs={12} sm={4}>
                    State:&nbsp;<Field name="state" component={renderTextField} label="Enter your State here" fullWidth />
                </Grid>
                <Grid item xs={12} sm={4}>
                    ZIP:&nbsp;<Field name="zip" component={renderTextField} label="Enter your ZIP here" fullWidth />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    Email:&nbsp;<Field name="email" component={renderTextField} label="Enter your Email here" fullWidth type="email" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    Tel:&nbsp;<Field name="telephone" component={renderTextField} label="Enter your Telephone here" type="password" fullWidth />
                </Grid>
            </Grid>
        </form>
    )
};

const validate = values => {
    const errors = {}

    const validEmail = (email) => {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return emailRegex.test(String(email).toLowerCase());
    }

    const validZIP = (number) => {
        const intRegex = /^[0-9]+$/;

        return intRegex.test(number);
    }

    if (!values.name) {
        errors.name = 'Required';
    } else if (values.name.length < 2) {
        errors.name = 'Must be at least 2 characters long';
    }
    if (!values.surname) {
        errors.surname = 'Required';
    } else if (values.surname.length < 2) {
        errors.surname = 'Must be at least 2 characters long';
    }

    if (!values.address) {
        errors.address = 'Required';
    } else if (values.address.length < 2) {
        errors.address = 'Must be at least 2 characters long';
    }

    if (!values.city) {
        errors.city = 'Required';
    } else if (values.city.length < 2) {
        errors.city = 'Must be at least 2 characters long';
    }
    if (!values.state) {
        errors.state = 'Required';
    } else if (values.state.length < 2) {
        errors.state = 'Must be at least 2 characters long';
    }
    if (!values.zip) {
        errors.zip = 'Required';
    } else if (values.zip.length < 4) {
        errors.zip = 'Must be at least 4 characters long';
    } else if (!validZIP(values.zip)) {
        errors.zip = 'Must contain only numbers';
    }

    if (!values.email) {
        errors.email = 'required';
    } else if (!validEmail(values.email)) {
        errors.email = 'Must be a valid email';
    }
    if (!values.telephone) {
        errors.telephone = 'required';
    } else if (values.telephone.length < 9) {
        errors.telephone = 'Must be at least 9 characters long';
    }

    return errors;
}

// Decorate with redux-form
ShipmentForm = reduxForm({
    form: 'shipmentForm',
    validate,
})(ShipmentForm)

// You have to connect() to any reducers that you wish to connect to yourself
ShipmentForm = connect(
    state => {
        return {
            initialValues: state.order.shipmentAddress, // pull initial values from account reducer
        };
    }
    
  )(ShipmentForm)

export default ShipmentForm;