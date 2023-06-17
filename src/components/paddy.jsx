import {  Button, List, ListItem, ListItemText } from '@mui/material';
//import IconButton from '@mui/material/IconButton'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import db from '../firbase';

import AddData from './adddata';
import Del, { Copy } from './deldata';
function Paddy({network}) {
    const loggedStatus = useSelector(e=>e.user.status);
    const user = useSelector(e=>e.user.user);
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]); 
    const getAllNotes =async ()=>{
        const q = query(collection(db,"notepad"), where("username", "==", user), orderBy("createdOn", "desc"));
        const querySnapshot = await getDocs(q);
        setNotes(querySnapshot.docs.map(e => [e.id,e.data()]))
        //window.localStorage.setItem("offline", JSON.stringify(querySnapshot.docs.map(e => [e.id,e.data()])))

    }
    
    useEffect(()=>{
        getAllNotes();
        if(!loggedStatus){navigate('/')}
        if(!network){
          navigate('/offline');
          //toast.warn('You Are Offline, But Read Last Paddy');
          //setNotes(JSON.parse(window.localStorage.getItem('offline')))
      }
    },[loggedStatus,network]);
  return (
    <div className='position-relative'>
        <List className='overflow-auto pb-4'>
        {notes.map((e)=>
            <ListItem key={e[0]}
            secondaryAction={
              <Del id={e[0]} getAllNotes={getAllNotes}/>
            }
          >     <Copy data={e[1].data}/>
            
            <ListItemText className='text-break'
              primary={e[1].data}
             
            />
          </ListItem>
        )}
        </List>
        {/* <AddData user={user} notes={notes} getAllNotes={getAllNotes}/> */}
        <Button className='rounded-circle position-absolute bottom end-0 m-2' color='primary'>
          <i className="bi bi-plus-lg"></i>
        </Button>
    </div>
  )
}

export default Paddy;