import Checkbox from '@material-ui/core/Checkbox';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

export const renderTextField = ({
    input,
    label,
    type,
    meta: { touched, error, warning },
    ...custom
}) => {
    let errorText = (touched && error) ? error : null;
    return (
        <TextField
            error={touched && error}
            label={label}
            helperText={errorText}
            {...input}
            {...custom}
        />
    );
}

export const renderCheckbox = ({ input, label }) => (
    <Checkbox
        label={label}
        checked={input.value ? true : false}
        onCheck={input.onChange}
    />
)

export const renderRadioGroup = ({ input, ...rest }) => (
    <RadioGroup
        {...input}
        {...rest}
        valueSelected={input.value}
        onChange={(event, value) => input.onChange(value)}
    />
)

export const renderSelectField = ({
    input,
    label,
    meta: { touched, error },
    children,
    ...custom
}) => (
    <Select
        floatingLabelText={label}
        errorText={touched && error}
        {...input}
        onChange={(event, index, value) => input.onChange(value)}
        children={children}
        {...custom}
    />
)