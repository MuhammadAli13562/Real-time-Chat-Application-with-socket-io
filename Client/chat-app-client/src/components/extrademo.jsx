import { useState } from "react"
import { io } from "socket.io-client";
import '../App.css'
import { useEffect } from "react";
import axios from 'axios'

const myName = 'AJ98';


export default function ChatBar ({user}){
    const [msg , setmsg] = useState("")
    const [rmsg , setrmsg] = useState([{msg : "test msg" , type:'client'}]);
    const [trig , settrig] = useState(false)
    const [auth , setauth] = useState(false)
    const [myUniqueName , setmyUniqueName] = useState("")

    var socket = io('http://localhost:3001' , {auth : {
        token : "123"  , UniqueName: myUniqueName
    }});


    useEffect(()=>{

        function callback(Response) {
            
            setrmsg(Response.data[0].Messages)
            console.log('DATA : ' , Response.data[0].Messages   );
        }

        axios.get('http://localhost:3001/82fbe8af599e9eb442cfd7b9a77a81eb').then(callback)


    } , [trig] )
    


    function handleSubmit(e) {
        e.preventDefault();

        socket.on('connect' , ()=>{
            console.log('Socket Now Connected');
            setauth(true)
        })
        socket.on('connect_error' , (err)=>{
            console.log('Error Occurred While Connecting to Server : ' ,err );
        })
    }

    function handleClick(e) {
        e.preventDefault()
        console.log('IN HANDLE CLIKC');
        
        socket.emit('client-message' , msg  , 'AqeelZafar98', (response)=>{
            console.log('RESPONSE ON MESSAGE : ',response);
        })
        
        
    }

    function handleClickServer(e) {
        e.preventDefault();
        socket.emit('server-message' , msg   ,(response)=>{
            console.log('RESPONSE ON MESSAGE : ',response);
        })
    }

    if (auth) {
        return (
            <div className="whole-chat-wrapper">
                <div className="chat-wrapper">
    
                        <div className="chat-box-wrapper" >
                            {rmsg && rmsg.map((elem)=>{
                        
                            if(elem.sender===myName)  return( <div className="sent-msg" > {elem.content} </div> )
                            else                      return( <div className="received-msg"> {elem.msg} </div> )
    
                        })}
    
                        </div>
    
                </div>
    
                <form className="form-wrapper">
                    <input type="text" onChange={(e)=>setmsg(e.target.value)}/>
                    <input type="submit" onClick={(e)=>handleClick(e)} value="Client Send"/>
                    <input type="submit" onClick={(e)=>handleClickServer(e)}value="Server Send" />
                </form>
            </div>
    )
    }
   
    else {
        return(
            <div>
                <form>
                    <input type="text" placeholder="Enter UniqueName" onChange={(e)=>setmyUniqueName(e.target.value)}/>
                    <input type="Submit" onClick={handleSubmit}/>
                </form>
            </div>
        )
    }

}