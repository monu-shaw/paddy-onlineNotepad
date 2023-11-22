import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useSelector, useDispatch } from 'react-redux';
import { logOut,setModal } from '../redux/reducers/users';
import React, { useEffect, useState } from 'react';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';

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
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PADDY.IO
          </Typography>
          {logStatus === true ? (
            <ButtonGroup variant="text" aria-label="text button group">
            <Button color="inherit" onClick={() => dispatch(logOut())}>
              <ExitToAppIcon/>
            </Button>
            <Button color="inherit" onClick={() => dispatch(setModal())}>
              <AddIcon />
            </Button>
          </ButtonGroup>
            
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
