const express = require('express')
const app     = express();
const http    = require('http')
const server  = http.createServer(app)
const {Server} = require('socket.io')
const io = new Server(server, { cors: { origin: '*' } });
const cors  = require('cors')
const { queryPostgres }   = require('./components/PostgreSQL/DatabaseOps')
const {IssueToken , storeID , checkID , VerifyToken} = require('./Authentication/jwtAuth')


/////////////////////////////////////////////////////////////////////////////////////////////////4

//                                 EXPRESS SERVER ---- IMPLEMENTATION

/////////////////////////////////////////////////////////////////////////////////////////////////


app.use (cors({exposedHeaders: ['token'] }))

app.get('/' , (req , res)=>{


        queryPostgres('SELECT * FROM social_table').then((result)=>{

            console.log('RESULT PROVIDED' , result.command);
            res.status(200).send(result.rows)
                    
        } , (err)=>{
            res.status(404).send(err.message)
            console.log('ERROR WHILE QUERYING : ' , err.message);
        })

})

app.post('/register' , storeID ,(req , res)=>{
    res.status(200).send('User Registered Succesfully ! ')
})

app.post('/login' , checkID , IssueToken ,(req , res)=>{
    console.log('response header : ' , res.getHeaders().token);
    if (res.getHeaders().token) {
        res.status(200).send('Token Issued Succesfuly !');     
        return;
    }
    res.status(404).send('Provide Complete Credentials')

})

app.post('/verify' , VerifyToken , (req , res)=>{
    res.status(200).send('Token Verified for Right Now')
})



/////////////////////////////////////////////////////////////////////////////////////////////////4

//                                 SOKCET IO SERVER ---- IMPLEMENTATION

/////////////////////////////////////////////////////////////////////////////////////////////////


io.on('connection' , (socket)=>{
    console.log('A User just Connected');
    
    socket.on('join-room' , arg=>{
        socket.join(arg);
    })
    
    socket.on('client-message' , (message , receiver , callback)=>{

        callback('ACK MESSAGE')
        socket.emit('ServerMsg' , message , receiver , 'client')
        io.emit('greetings' , 'Server Initialized')

    })

    socket.on('server-message' , (arg , callback)=>{
       
        callback('ACK MESSAGE')
        socket.emit('ServerMsg' , arg , 'server')
    })
    

})

//-----------------------------------------------------------


server.listen(3000 , ()=>{
    console.log('Server Listening at 3000');
})