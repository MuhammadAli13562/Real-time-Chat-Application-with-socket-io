import '../../../custom.css'
import { useNavigate } from "react-router-dom";
import { useEffect } from "react"
import axios from 'axios'

export default function ChatBox({selectedUser}) {
    const navigate = useNavigate();
    
   
if (selectedUser==='') {
    return(
     <div className='chat-box-wrapper'>   ChatBox   </div>
    )
}

return(
    <div className='chat-box-wrapper'>
       <div className='chat-box-inside-wrapper'>

        {selectedUser}
        <p>asda</p>
        <p>asda</p>
        <p>asda</p>
        <p>asda</p>
        <p>asda</p>
        <p>asda</p>
        <p>asda</p>
        <p>asda</p>
        <p>asda</p>
        <p>asda</p>
        <p>asda</p>
        <p>123</p>
        <p>123</p>
        <p>123</p>
        
       </div>
    </div>
)


}