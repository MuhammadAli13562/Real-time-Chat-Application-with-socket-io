import { Button, Container, Toolbar, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useState } from "react";
import '../custom.css'
import LoginIcon from '@mui/icons-material/Login';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'


export function Login() {
    
    const [ user  , setuser ] = useState('')
    const [ pass  , setpass ] = useState('')
    const navigate = useNavigate();
    const [msg , setmsg] = useState('')
    const [disable , setdisable] = useState(false)

    function handleSignIn() {
        setdisable(true);

        function callback1(response) {
            console.log('RESPONSE FROM SERVER : ' , response.data);
            console.log('TOKEN RECEIVED FROM SERVER : ' , response.headers.token);
            localStorage.setItem('token' , response.headers.token)
            setmsg('Succesfully Login')
            setdisable(false)
            navigate("/chats")
        }
        function callback2(response) {
            const errorMsg =  response.response.data.error;
            console.log('ERROR FROM SERVER : ' ,errorMsg);
            setmsg(errorMsg)
            setdisable(false)
        }


        axios.post('http://localhost:3000/login' , {} , { headers : {
            username : user,
            password : pass
        }}).then(callback1 , callback2)
    
    }

    return(
        
     <div>
        <div className='auth-wrapper'>
            <TextField variant="filled" label="Username" type="Username" onChange={(e)=>setuser(e.target.value)}/>
            <TextField variant="filled" label="Password" type="password" onChange={(e)=>setpass(e.target.value)}/>
            <Button disabled={disable} variant='contained' endIcon={<LoginIcon/>} onClick={handleSignIn}>Log In</Button>
            {msg!=='' &&  <div style={{color:'Red'}}>{msg}</div>}

        </div>



     </div>
        
    )
}