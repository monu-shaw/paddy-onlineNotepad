import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from '../redux/reducers/users';
import React, { useEffect, useState } from 'react';

export default function Navbar() {
  const logStatus = useSelector((state) => state.user.status);
  const dispatch = useDispatch();
  const [logMes, setLogMes] = useState(false);
  const currntPosition = useLocation().pathname;
  useEffect(() => {
    if (currntPosition === '/signup') {
      setLogMes(true);
    } else {
      setLogMes(false);
    }
  }, [currntPosition]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PADDY.IO
          </Typography>
          {logStatus === true ? (
            <Button color="inherit" onClick={() => dispatch(logOut())}>
              Logout
            </Button>
          ) : (
            <Button color="inherit">
              <Link
                to={logMes ? '/' : '/signup'}
                className="text-light text-decoration-none"
              >
                {logMes ? 'LogIn' : 'SignUp'}
              </Link>
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
