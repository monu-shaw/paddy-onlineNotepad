import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemText, Tab, Tabs, Skeleton } from '@mui/material';
//import IconButton from '@mui/material/IconButton'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import db from '../firbase';

import AddData from './adddata';
import Del, { Copy } from './deldata';
import { setModal } from '../redux/reducers/users'

function Paddy({ network }) {
  const { addModal: addNew } = useSelector(i => i.user)
  const [uiLoading,setUIloading] = useState(true)
  const dispatch = useDispatch()
  const loggedStatus = useSelector(e => e.user.status);
  const user = useSelector(e => e.user.user);
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [catList, setCatList] = useState([])

  const getAllNotes = async () => {
    const q = query(collection(db, "notepad"), where("username", "==", user), orderBy("createdOn", "desc"));
    const querySnapshot = await getDocs(q);
    //console.log(querySnapshot.docs)
    setUIloading(false)
    setNotes(querySnapshot.docs.map(e => [e.id, e.data()]))
    //window.localStorage.setItem("offline", JSON.stringify(querySnapshot.docs.map(e => [e.id,e.data()])))

  }

  useEffect(() => {
    getAllNotes();
    if (!loggedStatus) { navigate('/') }
    if (!network) {
      navigate('/offline');
    }
  }, [loggedStatus, network]);

  useEffect(()=>{
    setCatList([...new Set(notes.map(o=>o[1].category))]);
  },[notes])
  const [value, setValue] = React.useState(0);
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  if(uiLoading){
    return(
      <div>
        <div className="row mx-auto">
    <div className="col-3 p-2">
        <Skeleton variant="rounded" width={'24vw'} height={40} />
    </div>
    <div className="col-3 p-2">
        <Skeleton variant="rounded" width={'24vw'} height={40} />
    </div>
    <div className="col-3 p-2">
        <Skeleton variant="rounded" width={'24vw'} height={40} />
    </div>
    <div className="col-3 p-2">
        <Skeleton variant="rounded" width={'24vw'} height={40} />
    </div>
</div>
<div className="row">
    { Array(8).fill(0).map((i,iIndex)=>(
      <div key={iIndex+'sdfh'} className="col-12 my-2">
        <Skeleton variant="rounded" width={'98vw'} height={40} />
      </div>
    ))}
</div>
      </div>
    )
  }
  return (
    <div className='position-relative'>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={(v, nv) => setValue(nv)} aria-label="basic tabs example"   variant="scrollable" scrollButtons="auto">
            {catList.map((i,iIndex)=>(
              <Tab key={iIndex+"ay"} label={i} {...a11yProps(iIndex)} />
            ))}
          </Tabs>
        </Box>
        {catList.map((i,iIndex)=>(
          <CustomTabPanel key={iIndex+'kj'} value={value} index={iIndex}>
            <List className='overflow-auto pb-4'>
              {notes.filter(o=>o[1].category===i).map((e,pIndex)=>(
                <ListItem key={e[0]}
                  secondaryAction={
                    <Del id={e[0]} getAllNotes={getAllNotes} />
                  }
                >     <Copy data={e[1].data} />
      
                  <ListItemText className='text-break'
                    primary={<div dangerouslySetInnerHTML={{ __html: e[1].data }} />}
                  />
                </ListItem>
              ))}
              </List>
            </CustomTabPanel>
            ))}
      </Box>

      {/* <List className='overflow-auto pb-4'>
        {notes.map((e) =>
          <ListItem key={e[0]}
            secondaryAction={
              <Del id={e[0]} getAllNotes={getAllNotes} />
            }
          >     <Copy data={e[1].data} />

            <ListItemText className='text-break'
              primary={<div dangerouslySetInnerHTML={{ __html: e[1].data }} />}
            />
          </ListItem>
        )}
      </List> */}
      <AddNew open={addNew} notes={notes} user={user} getAllNotes={getAllNotes} />
    </div>
  )
}

export default Paddy;

const AddNew = ({ open, notes, user, getAllNotes }) => {
  const addFunction = useRef()
  const dispatch = useDispatch()
  const close = () => dispatch(setModal())
  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Add Notes</DialogTitle>
      <DialogContent>
        <AddData ref={addFunction} user={user} notes={notes} getAllNotes={getAllNotes} postFunction={close} />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>cancel</Button>
        <Button onClick={() => addFunction.current.click()} autoFocus>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}