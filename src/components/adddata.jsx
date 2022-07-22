import { Button, Container, TextField } from '@mui/material'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import React, {useEffect, useState} from 'react'
import db from '../firbase'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import{useDispatch, useSelector}from 'react-redux'
import { allCategory } from '../redux/reducers/users';

let Option=[]
function AddData({user, getAllNotes, notes}) {
    const dispatch = useDispatch()
    const Category = useSelector(e=>e.user.category)
    const [data, setData] = useState({
        data:'',
        user: user,
        collection: ''
    });
    const unique = (value, index, self) => {
        return self.indexOf(value) === index
      }
    useEffect(() => {
        Option = notes.map(e=> e[1].category);
        dispatch(allCategory(Option.filter(unique)))
    }, [notes])
    //console.log(Option);
    const addData =async ()=>{
        if(document.getElementById('standard-multiline-static').value !== '' && document.getElementById('collection').value !== ''){
            const addNew = await addDoc(collection(db, "notepad"), {
                    data: data.data,
                    username: data.user,
                    category: data.collection.toLowerCase(),
                    createdOn: serverTimestamp(),
            });
            if(addNew.id !== ''){
                toast.success("Sucssfully Saved");
                //notes.push([addNew.id,{data: data.data, username: data.user, createdOn: ''}]);
                getAllNotes()
                document.getElementById('standard-multiline-static').value ='';
                setData({data:'',user: user, collection: ''});
            }
        }else{
            toast.warn("Empty Feild");
        }
    }
   
  return (
    <>
           
    <ToastContainer position="top-right" />
        <Container fixed className='mx-auto fixed-bottom my-1 col-11'>
            <TextField
              className='col-12'
              id="standard-multiline-static"
              label="Data"
              multiline
              rows={3}
              variant="standard"
              onChange={e=>setData({...data, data: e.target.value})}
            />
            <input className='form-control mt-1' list="opyions" defaultValue="default" id="collection" onChange={e=>setData({...data, collection: e.target.value})}/>  
            <datalist id="opyions">
            {Category.map((e,index)=>
                <option key={index} value={e} />
                )}
            </datalist>
            <Button className="my-1 col-12" onClick={addData} color="success" variant="outlined">Save</Button>
        </Container>
    </>
  )
}

export default AddData
