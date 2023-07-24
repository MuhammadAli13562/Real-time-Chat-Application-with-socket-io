import { useEffect, useState } from "react"
import ChatSelector from "./Components/ChatSelector"
import ChatBox from "./Components/ChatBox"
import '../../custom.css'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

export default function ChatPage() {

    const [selectedUser , setselectedUser] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        const intervalId = setInterval(() => {
          // Refresh the page after every 20 seconds
          
          console.log('About to Refresh');
          window.location = '/chats'
          
        }, 20000);
    
        // Cleanup function to clear the interval when the component is unmounted
        return () => {
          clearInterval(intervalId);
        };
      }, []);
        
    useEffect(()=>{
        
        function callback1(response) {
            console.log('Returned in Success : ', response);
        }
        
        function callback2(response) {
            console.log('Returned with error : ' , response);
            navigate('/login')
        }

        axios.post('http://localhost:3000/verify' , {} , { headers : {
            authorization : 'bearer '+localStorage.getItem('token')
        }}).then(callback1 , callback2)

    } , [selectedUser , ])

    return (
        <div className="chat-page-wrapper">
            <ChatSelector setselectedUser = {setselectedUser}/>
            <ChatBox selectedUser = {selectedUser}/>
        </div>
    )
}