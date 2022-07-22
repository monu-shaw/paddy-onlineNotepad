import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { collection, query, where, getDocs } from "firebase/firestore";
import db from '../firbase'
import { useSelector, useDispatch } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { useEffect } from 'react';
import { logIN } from '../redux/reducers/users';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Login({network}) {
  const loggedStatus = useSelector(e=>e.user.status);
  const dispatch = useDispatch();
  const navigate= useNavigate();
  const LogIn= async ()=>{
      
    const q = query(collection(db, "users"), where("userName", "==", document.getElementById('outlined-basic').value));
    const querySnapshot = await getDocs(q);
    querySnapshot.docs.map(e => e.data()).length !== 0? dispatch(logIN(querySnapshot.docs.map(e => e.id))):toast.warn('Wrong UserName');
  }
  useEffect(()=>{
    if(loggedStatus){
      navigate('/home');
    }
    if(!network){navigate('/offline')}
  }, [loggedStatus,network]);


  return (
    <>
    
    <Box
        className="col-11 col-lg-6 d-flex flex-column justify-content-center mx-auto"
      component="form"
      sx={{
        '& > :not(style)': { m: 1, maxWidth: '100%' },
      }}
      noValidate
      autoComplete="off"
    >
        <Typography variant="h5" component="h5" align='center'>Log In To Paddy</Typography>
      <TextField className="col-12" id="outlined-basic" label="Enter Only UserName" variant="outlined"/>
      <Button className="my-1 col-12" variant="outlined" onClick={LogIn}>Let's Go</Button>
      <ToastContainer position="top-right" />
    </Box>
    <Typography variant="h6" component="p" align='center' className='mb-4 fixed-bottom col-11 col-md-9 col-lg-7 mx-auto nunito'>An Online Notepad For use To Copy All important notes. Specialy Design For Developer So Do not need to copy data on Every Devices. Chats are For Chatting Not For Copy and pasting. Try Today Paddy , Your Perfect Development Parnter.</Typography>
    </>
  );
}