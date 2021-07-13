import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Loader } from '../../commons/LoaderComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import SummaryCartView from './SummaryCart';
import ShipmentForm from './ShipmentForm';
import { doOrderSetCart, doOrderSetShipmentAddress, doOrderCreate } from '../../purchasing/orderSlice';
import { selectCartState, doCartReset } from '../../purchasing/shoppingCartSlice';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
}));


function ProcessView({cartState}) {
    const classes = useStyles();
    const dispatch = useDispatch();

    const steps = ['Review your cart', 'Insert shipping information', 'Submit order'];

    const [activeStep, setActiveStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState(new Set());

    const flagStepAsCompleted = (step) => {
        setCompletedSteps((prevCompletedSteps) => {
            let newCompletedSteps = new Set(prevCompletedSteps.values());
            newCompletedSteps.add(step);
            return newCompletedSteps; 
        });
    }

    const isStepCompleted = (step) => {
      return completedSteps.has(step);
    };

    useEffect( () => {
        setCompletedSteps(new Set());
        setActiveStep(0);
    }, []);
    
    let formState = useSelector((state) => state.form);
    const isShippingFormInvalid = () => {
        if (formState.shipmentForm === undefined) {
            return true;
        } else {
            return (formState.shipmentForm.syncErrors !== undefined);
        }
    }

    const doShippingFormSubmit = (shippingData) => {
        dispatch(doOrderSetShipmentAddress(shippingData, () => {
            flagStepAsCompleted(activeStep);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }));
    };

    const handleNext = () => {
        switch(activeStep) {
            case 0:
                dispatch(doOrderSetCart(cartState.cart, () => {
                    flagStepAsCompleted(activeStep);
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                }));
                break;
            case 1:
                doShippingFormSubmit(formState.shipmentForm?.values);
                break;
            case 2:
                dispatch(doOrderCreate(() => {
                    dispatch(doCartReset(() => {
                        flagStepAsCompleted(activeStep);
                    }));
                }));
                break;
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const isNextDisabled = () => {
        switch(activeStep) {
            case 0:
                return false;
            case 1:
                return isShippingFormInvalid();
            case 2:
                return isStepCompleted(activeStep);
            default:
                return true;
        }
    };

    const isBackDisabled = () => {
        switch(activeStep) {
            case 0:
                return true;
            case 1:
                return false;
            case 2:
                return isStepCompleted(2);
            default:
                return false;
        }
    };

    let processViewPanel = (<React.Fragment/>);
    switch (activeStep) {
        case 0:
            processViewPanel = (<SummaryCartView cartView={cartState.cartView} />);
            break;
        case 1:
            processViewPanel = (<ShipmentForm onSubmit={(event) => doShippingFormSubmit(event)} />);
            break;
        case 2:
            processViewPanel = (isStepCompleted(2))? (
                <Grid container direction="row">
                    <Grid item xs={12}>
                        The order has been placed, thank you.
                    </Grid>
                </Grid>
            ) :(
                <Grid container direction="row">
                    <Grid item xs={12}>
                        Click finish to issue the order. <br/>
                        After you place the order, the order details cannot be changed.
                    </Grid>
                </Grid>
            );
            break;
    }

    return (
        <Grid container spacing={2} direction="column">
            <Grid item>
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const stepProps = {};
                        if (isStepCompleted(index)) {
                            stepProps.completed = true;
                        }
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </Grid>
            <Grid item>
                {processViewPanel}
            </Grid>
            <Grid container item direction="row">
                <Grid item>
                    <Button
                        disabled={isBackDisabled()}
                        onClick={handleBack}
                        className={classes.button}
                    >
                        Back
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        disabled={isNextDisabled()}
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        className={classes.button}
                    >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}

function Checkout(props) {
    const cartState = useSelector(selectCartState);
    const cartView = cartState.cartView;

    let cartViewHasEntries = (cartView.entries !== undefined && (cartView.entries.length > 0));

    return(
        <div className="container">
            <div className="row">
                <div className="col">
                    <h2>Checkout</h2>
                    <hr/>
                </div>
            </div>
            <div className="row row-content">
                <div className="col">
                    <Loader isLoading={cartState.isLoadInprogress} errMess={cartState.loadErrMess}>
                        <ProcessView cartState={cartState} />
                    </Loader>
                </div>
            </div>
        </div>
    );
}

export default Checkout;