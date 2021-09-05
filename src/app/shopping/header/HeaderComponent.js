import React, { useState, useEffect, useRef } from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import BallotIcon from '@material-ui/icons/Ballot';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MoreIcon from '@material-ui/icons/MoreVert';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import LoginForm from './LoginForm';
import SearchComponent from './SearchComponent';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { selectAuthentication, doLogin, doLogout } from '../../authentication/authenticationSlice';
import { selectCartState, doCartLoad, doCartClear } from '../../purchasing/shoppingCartSlice';
import { AccountCircle } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    display: 'flex',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      }
    },
    [theme.breakpoints.up('md')]: {
      width: '20ch',
      '&:focus': {
        width: '70ch',
      }
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function CartIconButton(props) {
  const cartState = useSelector(selectCartState);

  let cartItems = 0;
  for (const entry of cartState.cart.entries) {
    cartItems += entry.quantity;
  }

  let badgeAndIcon = (cartState.cart.entries.length > 0) ? (
    <Badge color="secondary" badgeContent={cartItems}>
      <ShoppingCartIcon />
    </Badge>
  ) : (
    <Badge color="secondary" variant="dot">
      <ShoppingCartIcon />
    </Badge>
  );

  return (
    <IconButton
      edge="end"
      aria-label="cart of current user"
      aria-haspopup="false"
      onClick={props.onClick}
      color="inherit"
      disabled={props.disabled}
    >
      {badgeAndIcon}
    </IconButton >
  );
}

export default function Header() {
  const classes = useStyles();
  const history = useHistory();

  const searchRef = useRef({});

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const isMenuOpen = Boolean(menuAnchorEl);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);

  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const dispatch = useDispatch();
  const authentication = useSelector(selectAuthentication);
  const cartState = useSelector(selectCartState);

  const handleUserMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setMenuAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const onLoginRequest = () => {
    handleUserMenuClose();
    handleMobileMenuClose();
    handleLoginModalOpen();
  }

  const onLogoutRequest = () => {
    handleUserMenuClose();
    handleMobileMenuClose();
    dispatch(doLogout(() => {
      dispatch(doCartClear());
    }));
  }

  const handleLoginModalOpen = () => {
    setLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setLoginModalOpen(false);
  };

  const handleLoginFormSubmit = (loginData) => {
    dispatch(doLogin(loginData, (loginSuccess) => {
      if (loginSuccess) {
        handleLoginModalClose();
        setTimeout(() => {
          dispatch(doCartLoad());
        }, 1);
      }
    }));
  };

  const onLogoClick = () => {
    searchRef.current.clearValue();
    history.push('/home');
  }

  const onCartClick = () => {
    setMenuAnchorEl(null);
    handleMobileMenuClose();
    history.push('/cart');
  };

  const onOrdersClick = () => {
    setMenuAnchorEl(null);
    handleMobileMenuClose();
    history.push('/orders');
  }

  useEffect(() => {
    setTimeout(() => {
      if (authentication.isAuthenticated) {
        dispatch(doCartLoad());
      }
    }, 1000);
  }, [dispatch, authentication.isAuthenticated]);

  const menuId = 'primary-search-account-menu';
  const renderUserMenu = (authentication.isAuthenticated) ? (
    <Menu
      anchorEl={menuAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleUserMenuClose}
    >
      <MenuItem onClick={onOrdersClick}>Orders</MenuItem>
      <MenuItem onClick={onLogoutRequest}>Logout</MenuItem>
    </Menu>
  ) : (
    <Menu
      anchorEl={menuAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleUserMenuClose}
    >
      <MenuItem onClick={onLoginRequest}>Login</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (authentication.isAuthenticated) ? (
    <Menu
      anchorEl={mobileMenuAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={onCartClick}>
        <IconButton
          aria-label="cart of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="false"
          color="inherit"
        >
          <ShoppingCartIcon />
        </IconButton>
        <p>Cart</p>
      </MenuItem>
      <MenuItem onClick={onOrdersClick}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <BallotIcon />
        </IconButton>
        <p>Orders</p>
      </MenuItem>
      <MenuItem onClick={onLogoutRequest}>
        <IconButton
          aria-label="Request logout"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <ExitToAppIcon />
        </IconButton>
        <p>Logout</p>
      </MenuItem>
    </Menu>
  ) : (
    <Menu
      anchorEl={mobileMenuAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={onLoginRequest}>
        <IconButton
          aria-label="Request login"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <ExitToAppIcon />
        </IconButton>
        <p>Login</p>
      </MenuItem>
    </Menu>
  );

  const cartIconDisabled = (!authentication.isAuthenticated) || cartState.isLoadInprogress || (cartState.loadErrMess != null);

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap onClick={onLogoClick}>
            Alexandria
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <SearchComponent
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}

              reference={searchRef}

              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <CartIconButton onClick={onCartClick} disabled={cartIconDisabled} />
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleUserMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderUserMenu}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={loginModalOpen}
        onClose={handleLoginModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={loginModalOpen}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">LogIn to Alexandria</h2>
            <LoginForm onSubmit={(event) => handleLoginFormSubmit(event)} />
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
