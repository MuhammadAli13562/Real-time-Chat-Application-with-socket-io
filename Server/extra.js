const express = require('express')
const app     = express()
const http    = require('http')
const server  = http.createServer(app)
const {Server} = require('socket.io')
const io = new Server(server, { cors: { origin: '*' } });
const AuthorizeSocket = require('./components/AuthorizeSocket')
const { saveUserChat , getUserChat } = require('./components/Database/DatabaseOps')
const crypto = require('crypto')
const cors  = require('cors')
io.use(AuthorizeSocket)

// HANDLE MOGODB OPERATIONS
function generateID(input1, input2) {
    const combinedString = `${input1}${input2}`;
    const hash = crypto.createHash('md5').update(combinedString).digest('hex');
    return hash;
  }

// ON CONNECTION TO THE SERVER

io.on('connection' , (socket)=>{
    console.log('A User just Connected');
    
    socket.on('join-room' , arg=>{
        socket.join(arg);
    })
    
    socket.on('client-message' , (message , receiver , callback)=>{
        //console.log('Message Received :' , message);
        callback('ACK MESSAGE')
        socket.emit('ServerMsg' , message , receiver , 'client')
        io.emit('greetings' , 'Server Initialized')

        //console.log('Socket : ' , socket);



//        Save in MongoDB

        let newMessage = {
            content :  message , 
            timeRef :  Date.now(),
            sender  :  socket.handshake.auth.UniqueName
        }
        let room = {
            RoomID :generateID(socket.handshake.auth.UniqueName , receiver) ,
            participants : [ socket.handshake.auth.UniqueName , receiver] ,
            Messages     : newMessage
        }

        saveUserChat(room)

    })

    socket.on('server-message' , (arg , callback)=>{
        console.log('Message Received :' , arg);
        callback('ACK MESSAGE')
        socket.emit('ServerMsg' , arg , 'server')
    })
    

})

//-----------------------------------------------------------


//  SERVER FUNCTIONS FOR RETREIVING DATA
app.use(cors())

app.get('/:RoomID' , async(req , res)=>{
    const {RoomID} = req.params
    const ret_Data =  await getUserChat(RoomID);
    res.status(200).json(ret_Data)
})

server.listen(3001 , ()=>{
    console.log('Server Listening at 3001');
})