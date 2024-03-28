import { Button, Card, CardActions, CardContent, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import db from '../firbase';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { collection, getDocs, orderBy, query, where,addDoc, serverTimestamp  } from 'firebase/firestore';
import axios from 'axios';
import { extractAllUrls } from './paddy';

function Share() {
    const [data, setData] = useState({})
    const loggedStatus = useSelector(e=>e.user.status);
    const user = useSelector(e=>e.user.user);
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState(null);
    const [category , setCategory] = useState(null)
    const [catList, setCatList] = useState([])
    const [preview,setPreview] = useState({img:'',title:'',description:''})
    const addData = async () => {
            const addNew = await addDoc(collection(db, "notepad"), {
                data: `${title} ${data.text}`,
                username: user, 
                category: category?category:'shared',
                preview,
                url:data?.uri,
                createdOn: serverTimestamp(),
            });
            if(addNew.id !== ''){
                navigate('/',{replace:true})
            }else{
                alert('failed');
                navigate('/',{replace:true});
            }
         
    }
    const getAllNotes = async () => {
        const q = query(collection(db, "notepad"), where("username", "==", user), orderBy("createdOn", "desc"));
        const querySnapshot = await getDocs(q);
        setCatList([...new Set(querySnapshot.docs.map(e => [e.id, e.data()]).map(o=>o[1].category))]);
        localStorage.setItem('cat',JSON.stringify([...new Set(querySnapshot.docs.map(e => [e.id, e.data()]).map(o=>o[1].category))]));
      }

useEffect(() => {
    if(localStorage.getItem('cat')){
        setCatList(JSON.parse(localStorage.getItem('cat')))
    }else{getAllNotes()}
    var parsedUrl = new URL(window.location.toString());
    if(loggedStatus){
        setLoading(false)
        setData({text: ` - <a href="${extractAllUrls(parsedUrl.searchParams.get('text'))}" target="_blank">${parsedUrl.searchParams.get('text')}</a>  - ${parsedUrl.searchParams.get('url')?parsedUrl.searchParams.get('url'):''}`,uri:parsedUrl.searchParams.get('text')}) 
        setTitle(parsedUrl.searchParams.get('title')?parsedUrl.searchParams.get('title'):'')
        setCategory('shared')
        axios.get('https://ourinshort.netlify.app/.netlify/functions/seo?url='+parsedUrl.searchParams.get('text'))
        .then(r=>{
            console.log(r);
            setPreview({
                "img": r?.data?.data?.img?r?.data?.data?.img:null,
                "title": r?.data?.data?.title?r?.data?.data?.title:null,
                "description": r?.data?.data?.description?r?.data?.data?.description:null,
            })
        }).catch(er=>console.log(er))

    }else{
        setError(true);
        setLoading(false);
    }        
}, [])
if(loading){
    return <CircularProgress />
}

if(error){
    return (
        <Card>
            <CardContent>
                <Typography variant='h4' component={'div'} className='text-center'>
                    {window.location.toString()}
                    {JSON.stringify(data)}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={()=>navigate('/')}>Retry</Button>
            </CardActions>
        </Card>
    )
}

return (
    <Card className='shadow-none shadow-none'>
            
            <CardActions>
                <Button size="small" onClick={()=>getAllNotes('/')}>Refresh Categories</Button>
            </CardActions>
            <Container maxWidth="sm">
              <Box sx={{ bgcolor: '#cfe8fc', minHeight: '50vh' }} className='d-flex flex-column justify-content-center pt-4 px-5 gap-3' >
                <Typography style={{height: '10vh'}} className='text-break overflow-auto'>
                    {`${title} ${data.text}`}
                </Typography>
                <TextField id="outlined-basic" label="Outlined" variant="outlined" value={title} onChange={e=>setTitle(e.target.value)} />
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Age"
                  value={category}
                  onChange={(e)=>setCategory(e.target.value)}
                >
                  {catList.map(i=><MenuItem key={i} value={i} className='text-capitalize'>{i}</MenuItem>)}
                </Select>
                <div className='d-flex justify-content-end'>
                    <Button onClick={addData} variant="outlined">Save</Button>
                </div>
              </Box>
              <div className="col-4 mx-auto">
                <div className="card">
                    <img src={preview.img} alt="" />
                    <h6>{preview.description}</h6>
                    <p>{preview.title}</p>
                </div>
              </div>
            </Container>
        </Card>
)
}

export default Share