import { IconButton } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';

import { doc, deleteDoc } from "firebase/firestore";
import db from "../firbase";

import { pink } from "@mui/material/colors";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function extractContent(s) {
    var span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  };

export default function Del({id, getAllNotes}) {
    const del = async ()=>{
         await deleteDoc(doc(db, "notepad", id));
         toast.error('Deleted !', {autoClose: 2000})
        getAllNotes()
    }
  return (
    <IconButton edge="end" aria-label="delete" onClick={del}>
        <DeleteIcon sx={{ color: pink[300] }}/>
    </IconButton>
  )
}

export const Copy = ({data}) =>{
    const copy = ()=>{
        navigator.clipboard.writeText(extractContent(data));
        toast.success("Copied", {autoClose: 2000});
    }
    return(
        <IconButton sx={{ fontSize: 20 }} edge="start" aria-label="copy" onClick={copy}>
            <FileCopyIcon color="primary"/>
        </IconButton>
    )
}
