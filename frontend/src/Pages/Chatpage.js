import React, { useEffect, useState } from 'react'
import axios from 'axios'
const Chatpage = () => {
    const [chats, setChats] = useState([])

    // Making an api call using axios
    const fetchChats = async () => {
        const { data } = await axios.get('/api/chat')
        // setting data 
        setChats(data)
        // console.log("data :",data)
    }
    // To call the function we are using  
    // useEffect is a hook in react which runs 
    // when function got rendered for thr firsttime
    useEffect(() => {
        // function to call
        fetchChats();
    }, [])
    return (
        <div>
            {chats.map(chat =>
                <div  key={chat._id}>
                    {chat.chatName}
                </div>)}
        </div>
    )
}

export default Chatpage
