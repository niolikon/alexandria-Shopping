import { createTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';

const theme = createTheme({
  palette: {
    primary: {
      main: indigo[400],
    },
    secondary: {
      main: indigo[100],
    },
  },
});

export default theme;