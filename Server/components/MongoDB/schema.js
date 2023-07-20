
const mongoose = require('mongoose')

const chatSchema  =  new mongoose.Schema({
    content : String ,
    timeRef : Number ,
    sender  : String
})

const RoomSchema = new mongoose.Schema({
    RoomID : String,
    participants : Array ,
    Messages     : [chatSchema]
})

 const Room = mongoose.model('chatRooms' , RoomSchema)

 module.exports = {Room}

 