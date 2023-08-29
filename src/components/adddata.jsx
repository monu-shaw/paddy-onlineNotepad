import { Autocomplete, Button, Container, FormLabel, MenuItem, Select, TextField } from '@mui/material'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import React, { forwardRef, useEffect, useState } from 'react'
import db from '../firbase'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useDispatch, useSelector } from 'react-redux'
import { allCategory } from '../redux/reducers/users';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

let Option = []

const AddData = forwardRef(function({ user, getAllNotes, notes,postFunction },ref){
  const dispatch = useDispatch()
  const Category = useSelector(e => e.user.category)
  const [data, setData] = useState({
    data: '',
    user: user,
    collection: ''
  });
  const unique = (value, index, self) => {
    return self.indexOf(value) === index
  }
  useEffect(() => {
    Option = notes.map(e => e[1].category);
    dispatch(allCategory(Option.filter(unique)))
  }, [notes])
  const addData = async () => {
    if (data.data !== '' && data.collection !== '') {
      const addNew = await addDoc(collection(db, "notepad"), {
        data: data.data,
        username: data.user,
        category: data.collection.toLowerCase(),
        createdOn: serverTimestamp(),
      });
      if (addNew.id !== '') {
        toast.success("Sucssfully Saved");
        //notes.push([addNew.id,{data: data.data, username: data.user, createdOn: ''}]);
        postFunction()
        getAllNotes()
        document.getElementById('standard-multiline-static').value = '';
        setData({ data: '', user: user, collection: '' });
      }
    } else {
      toast.warn("Empty Feild");
    }
  }

  return (
    <>

      <ToastContainer position="top-right"/>
      <Container fixed className='mx-auto my-1 col-12'>
        <div style={{ minHeight: '200px' }} className='my-2'>
          <ReactQuill
            toolbarOptions={['bold', 'italic', 'underline', 'strikethrough']}
            value={data.data} theme='snow' onChange={e => setData({ ...data, data: e })} />
        </div>
        <Autocomplete
          freeSolo
          placeholder="Type anything"
          options={Category.map((option) => option)}
          onChange={(e,v)=>setData(i=>({...i, collection: v}))}
          renderInput={(params) => <TextField {...params} label="Collection" />}
        />
        <Button className="my-1 col-12 opacity-0" style={{minHeight:'1px'}}  onClick={addData} ref={ref} color="success" variant="outlined">Save</Button>
      </Container>
    </>
  )
})

export default AddData
