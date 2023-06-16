import React, { useEffect, useState } from 'react'

function Share() {
    const [data, setData] = useState({})

    const addData = async () => {
        if (document.getElementById('standard-multiline-static').value !== '' && document.getElementById('collection').value !== '') {
            const addNew = await addDoc(collection(db, "notepad"), {
                data: data.data,
                username: data.user,
                category: data.collection.toLowerCase(),
                createdOn: serverTimestamp(),
            });
            if (addNew.id !== '') {
                toast.success("Sucssfully Saved");
                //notes.push([addNew.id,{data: data.data, username: data.user, createdOn: ''}]);
                getAllNotes()
                document.getElementById('standard-multiline-static').value = '';
                setData({ data: '', user: user, collection: '' });
            }
        } else {
            toast.warn("Empty Feild");
        }
    }
useEffect(() => {
    var parsedUrl = new URL(window.location.toString());
    setData({category})
    console.log('Title shared: ' + parsedUrl.searchParams.get('name'));
    console.log('Text shared: ' + parsedUrl.searchParams.get('description'));
    console.log('URL shared: ' + parsedUrl.searchParams.get('link'));
}, [])
return (
    <div>Share</div>
)
}

export default Share