const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });
const cors = require("cors");
const { queryPostgres } = require("./Databases/PostgreSQL/DatabaseOps");
const {
  IssueToken,
  storeID,
  checkID,
  VerifyToken,
} = require("./Services/Authentication/jwtAuth");
const {
  FindRoomsfromDB,
  LoadDefaultMessagesfromDB,
  StoreMessageinDB,
} = require("./Services/DB/chatTableOps");
const {
  VerifySocketToken,
  generateHash,
} = require("./Services/Authentication/socketauth");

/////////////////////////////////////////////////////////////////////////////////////////////////4

//                                 EXPRESS SERVER ---- IMPLEMENTATION

/////////////////////////////////////////////////////////////////////////////////////////////////

app.use(cors({ exposedHeaders: ["token"] }));

app.get("/", (req, res) => {
  queryPostgres("SELECT * FROM social_table").then(
    (result) => {
      console.log("RESULT PROVIDED", result.command);
      res.status(200).send(result.rows);
    },
    (err) => {
      res.status(404).send(err.message);
      console.log("ERROR WHILE QUERYING : ", err.message);
    }
  );
});

app.post("/register", storeID, (req, res) => {
  res.status(200).send("User Registered Succesfully ! ");
});

app.post("/login", checkID, IssueToken, (req, res) => {
  console.log("response header : ", res.getHeaders().token);
  if (res.getHeaders().token) {
    res.status(200).send("Token Issued Succesfuly !");
    return;
  }
  res.status(404).send("Provide Complete Credentials");
});

app.post("/verify", VerifyToken, (req, res) => {
  res.status(200).send("Token Verified for Right Now");
});

/////////////////////////////////////////////////////////////////////////////////////////////////4

//                                 SOKCET IO SERVER ---- IMPLEMENTATION

/////////////////////////////////////////////////////////////////////////////////////////////////

io.on("connection", async (socket) => {
  console.log("A User just Connected");
  const result = await VerifySocketToken(socket.handshake.auth.token);
  const username = result?.username;
  const userID = result?.userid;

  ///////////////////////////////////////////////////////////////////////////////////////////
  //                      ALL DEFAULT HANDLING                          //

  ////////////////////////////////////////////////////////////////////////
  //               DEFAULT ROOM JOINING BASED ON USER ID               //

  const roomsObject = await FindRoomsfromDB(socket);

  if (roomsObject !== -1) {
    const roomArray = roomsObject.map((elem) => elem.roomid);
    socket.join(roomArray);
    socket.emit("default_rooms", roomArray);

    //////////////////////////////////////////////////////////////////////
    //              DEFAULT MESSAGES BASED ON ROOMS AND USER IDs        //

    const default_messages = await LoadDefaultMessagesfromDB(roomArray);
    socket.emit("default_messages", default_messages);
  }

  ////////////////////////////////////////////////////////////////////////
  //                     SOCKET IO EVENT HANDLING                      //

  socket.on("join-room", (arg) => {
    socket.join(arg);
  });

  socket.on("room-message-client", (message, roomid) => {
    const timestamp = Date.now();

    const RoomMsg = {
      roomid,
      messageid: generateHash(message, String(timestamp)),
      content: message,
      timestamp,
      senderid: userID,
      sendername: username,
    };
    io.in(roomid).emit("room_message", RoomMsg);
    StoreMessageinDB(RoomMsg).then(
      (MSG) => console.log("Message Stroed in DB", MSG),
      (errorMsg) => console.log("Error while Storing : ", errorMsg)
    );
  });
});

//-----------------------------------------------------------

server.listen(3000, () => {
  console.log("Server Listening at 3000");
});
