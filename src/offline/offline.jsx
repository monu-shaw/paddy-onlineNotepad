import { Typography } from '@mui/material'
import React, { useEffect } from 'react'
import offlineIMage from '../assets/gifs/Dino_Skate_Thumb.gif'
function Offline({network}) {
    useEffect(() => {
        if(network){window.history.back()}
    }, [network])
    
  return (
    <div className='xs-6 md-8 d-flex flex-column justify-content-center align-self-center' style={{height: '98vh'}}>
        <img src={offlineIMage} alt="" style={{width: '100%'}}  />
        <Typography className='text-bold' variant="h5" component="h5" align='center'>OFFLINE</Typography>
    </div>
  )
}

export default Offline