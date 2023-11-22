import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemText, Tab, Tabs, Skeleton, ListSubheader, Collapse } from '@mui/material';
//import IconButton from '@mui/material/IconButton'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import db from '../firbase';

import AddData from './adddata';
import Del, { Copy } from './deldata';
import { setModal } from '../redux/reducers/users'
import { useSwipeable } from 'react-swipeable';

function Paddy({ network }) {
  const { addModal: addNew } = useSelector(i => i.user)
  const [uiLoading,setUIloading] = useState(true)
  const dispatch = useDispatch()
  const loggedStatus = useSelector(e => e.user.status);
  const user = useSelector(e => e.user.user);
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [catList, setCatList] = useState([]);
  const [hashCatlist, setHashCatlist]= useState({});
  const [openid,setopenId] = useState(-1)

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
    let a = [...new Set(notes.map(o=>o[1].category))];
    setCatList([...a]);
    let aObj= {}
    a.forEach(i=>{
      aObj[i] =[]
    })
    notes.forEach(o=>{
      (aObj[o[1].category]).push(o)
    })
    setHashCatlist(aObj)

  },[notes])
  const [value, setValue] = React.useState(0);
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  const handlers = useSwipeable({
    onSwiped: (e) => {
      let l = Object.keys(hashCatlist).length;
      switch(e.dir){
        case "Right":
          if(value>0){
            setValue(v=>--v)
          }
        break;
        case "Left":
          if(value<l-1){
            setValue(v=>++v)
          }
        break;
      }
    },
    delta:120
  });
  if(uiLoading){
    return(
      <div>
        <div className="row mx-auto mx-0">
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
          {Array(8).fill(0).map((i, iIndex) => (
            <div key={iIndex + 'sdfh'} className="col-12 my-2">
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
            {Object.keys(hashCatlist).map((i,iIndex)=>(
              <Tab key={iIndex+"ay"} label={i} {...a11yProps(i)} />
            ))}
          </Tabs>
        </Box>
        {Object.keys(hashCatlist).map((i,iIndex)=>(
          <CustomTabPanel key={i} value={value} index={iIndex} className="cstTab">
            <span {...handlers}>
              <List className='overflow-auto pb-4'>
                {hashCatlist[i].map((e, pIndex) => (
                  <span key={e[0]}>
                    <ListItem key={e[0] + 't'}
                      secondaryAction={
                        <Del id={e[0]} getAllNotes={getAllNotes} />
                      }
                    >

                      <Copy data={e[1].data} />
                      <ListItemText className='text-break'
                        primary={<div dangerouslySetInnerHTML={{ __html: e[1].data }} />}
                      />
                      {e[1].preview ?
                        <p className='ps-1' onClick={() => setopenId(i => i === -1 ? e[0] + 'tab' : -1)}>{'>'}</p>
                        : ''}
                    </ListItem>
                    {e[1].preview ?
                      <Collapse in={e[0] + 'tab' === openid} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          <LinkUI data={e[1].preview} />
                        </List>
                      </Collapse>
                      : ''}
                  </span>
                ))}
              </List>
            </span>
            </CustomTabPanel>
            ))}
      </Box>
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

export const LinkUI = ({data}) => {
  return (
      <div className='d-flex gap-1 overflow-hidden rounded-2 col-12 col-md-9 col-lg-6 mb-1' style={{backgroundColor:'#fcfcfc'}}>
        <div className=''>
          <img src={data?.img} alt="" style={{width:'100px',height:'100px'}} />
        </div>
        <div className='text-wrap'>
          <h5 className='fw-bold'>{data.title}</h5>
          <p className='text-truncate text-wrap'>{(data?.description?data?.description:'').substring(0,50)}</p>
        </div>
      </div>
  );
};

