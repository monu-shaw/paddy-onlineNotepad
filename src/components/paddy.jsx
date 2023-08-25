import {  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemText } from '@mui/material';
//import IconButton from '@mui/material/IconButton'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import db from '../firbase';

import AddData from './adddata';
import Del, { Copy } from './deldata';
import {setModal} from '../redux/reducers/users'
function Paddy({network}) {
    const addNew = useSelector(i=>i.e.addModal)
    const dispatch = useDispatch()
    const loggedStatus = useSelector(e=>e.user.status);
    const user = useSelector(e=>e.user.user);
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]); 
    const getAllNotes =async ()=>{
        const q = query(collection(db,"notepad"), where("username", "==", user), orderBy("createdOn", "desc"));
        const querySnapshot = await getDocs(q);
       alert(JSON.stringify(querySnapshot.docs[0].data))
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
        <button onClick={()=>dispatch(setModal())} className='rounded-circle position-absolute bottom-0 end-0 m-2 btn btn-primary'>
          <i className="bi bi-plus-lg"></i>
        </button>
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
        <AddNew open={addNew} close={(e)=>dispatch(setModal())} notes={notes} user={user} getAllNotes={getAllNotes} />
    </div>
  )
}

export default Paddy;

const AddNew =({open,close,notes,user,getAllNotes})=>{
  return(
    <Dialog open={open} onClose={close}>
        <DialogTitle>Add Notes</DialogTitle>
        <DialogContent>
          <AddData user={user} notes={notes} getAllNotes={getAllNotes}/>
        </DialogContent>
      </Dialog>
  )
}