import { Button, Container, Toolbar, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useState } from "react";
import '../custom.css'
import HowToRegIcon from '@mui/icons-material/HowToReg';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'


export function Register() {
    
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
            setmsg('Succesfully Registered')
            setdisable(false)
        }
        function callback2(response) {
            const errorMsg =  response.response.data.error.split(' ')[0];
            console.log('ERROR FROM SERVER : ' ,errorMsg);
            if (errorMsg==='duplicate') {
                
                setmsg('Username Already Taken')
            }
            setdisable(false)
        }


        axios.post('http://localhost:3000/register' , {} , { headers : {
            username : user,
            password : pass
        }}).then(callback1 , callback2)
    
    }

    return(
        
     <div>
        <div className='auth-wrapper'>
            <TextField variant="filled" label="Username" type="Username" onChange={(e)=>setuser(e.target.value)}/>
            {msg==='Username Already Taken' &&  <div style={{color:'red'}}>*{msg}</div>}
            <TextField variant="filled" label="Password" type="password" onChange={(e)=>setpass(e.target.value)}/>
            <Button disabled={disable} variant='contained' endIcon={<HowToRegIcon/>} onClick={handleSignIn}>Register</Button>
            {msg==='Succesfully Registered' &&  <div style={{color:'green'}}>{msg}</div>}

        </div>



     </div>
        
    )
}