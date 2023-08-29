import { Button, Card, CardActions, CardContent, CircularProgress, Typography } from '@mui/material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import db from '../firbase';

function Share() {
    const [data, setData] = useState({})
    const loggedStatus = useSelector(e=>e.user.status);
    const user = useSelector(e=>e.user.user);
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const addData = async () => {
            const addNew = await addDoc(collection(db, "notepad"), {
                data: data.text,
                username: user, 
                category: 'shared',
                createdOn: serverTimestamp(),
            });
            if(addNew.id !== ''){
                navigate('/')
            }else{
                alert('failed');
                navigate('/');
            }
         
    }

useEffect(()=>{
    if(data?.text){
        addData();
    }
},[data])
useEffect(() => {
    var parsedUrl = new URL(window.location.toString());
    if(loggedStatus){
        setLoading(false)
        setData({text: `${parsedUrl.searchParams.get('title')} - <a href="${parsedUrl.searchParams.get('text')}" target="_blank">${parsedUrl.searchParams.get('text')}</a>  - ${parsedUrl.searchParams.get('url')}`}) 

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
    <Card>
            <CardContent>
                <Typography variant='h4' component={'div'} className='text-center'>
                    {window.location.toString()}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={()=>navigate('/')}>Retry</Button>
            </CardActions>
        </Card>
)
}

export default Share