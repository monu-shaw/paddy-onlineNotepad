import { Button, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'
import {Link, useNavigate} from 'react-router-dom'
import { collection, query, where, getDocs,  serverTimestamp, addDoc } from "firebase/firestore";
import db from '../firbase'
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup({network}) {
    const loggedStatus = useSelector(e=>e.user.status);
    const navigate= useNavigate();
    const SignUp = async ()=>{
      if(String(document.getElementById('addPhrase').value) === 'superDuper'){
        const q = query(collection(db, "users"), where("userName", "==", document.getElementById('outlined-basic').value));
        const querySnapshot = await getDocs(q);
        if(querySnapshot.docs.map(e => e.data()).length === 0){
        const addNew   = await addDoc(collection(db, "users"), {
                userName: document.getElementById('outlined-basic').value,
                createdOn: serverTimestamp(),
            });
                if(addNew.id !== ''){navigate('/')}
        }else{
          toast.warn('UserName Already Exist');
        }
        }else{
          toast.warn('Incorrect Phrase');
        }
    }
    useEffect(()=>{
        if(loggedStatus){
          navigate('/home');
        }
        if(!network){navigate('/offline')}
      }, [loggedStatus, network]);
  return (
    <Box
        className="col-11 col-lg-6 d-flex flex-column justify-content-center mx-auto"
      component="form"
      sx={{
        '& > :not(style)': { m: 1, maxWidth: '97%' },
      }}
      noValidate
      autoComplete="off"
    >
        <Typography variant="h5" component="h5" align='center'>Add User To Paddy</Typography>
      <TextField className="col-12" id="addPhrase" label="Enter Add Phrase" variant="outlined"/>
      <TextField className="col-12" id="outlined-basic" label="Enter Only UserName" variant="outlined"/>
      <Button className="my-1 col-12" variant="outlined" onClick={SignUp}>Let's Go</Button>
      <Typography variant="h6" component="p" align='center' className='mb-4 fixed-bottom col-11 col-md-9 col-lg-7 mx-auto nunito'>Currently Its In Beta Testing Mode So We limited Access To our Beta Testers only.<Link to="/signupasbetatester">Become Our Beta Testers</Link></Typography>
      
    </Box>
  )
}

export default Signup