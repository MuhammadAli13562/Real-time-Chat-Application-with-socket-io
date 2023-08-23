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
  JoinRoominDB,
  ExitRoominDB,
  FindRoomParticipantsfromDB,
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

//                                 SOCKET IO SERVER ---- IMPLEMENTATION

/////////////////////////////////////////////////////////////////////////////////////////////////

io.on("connection", async (socket) => {
  console.log("A User just Connected");
  const result = await VerifySocketToken(socket.handshake.auth.token);
  const username = result?.username;
  const userID = result?.userid;

  ///////////////////////////////////////////////////////////////////////
  //                      DEFAULT HANDLERS                            //

  async function default_handling() {
    const roomsObject = await FindRoomsfromDB(socket);

    if (roomsObject !== -1) {
      const roomArray = roomsObject.map((elem) => elem.roomid);
      socket.join(roomArray);
      socket.emit("default_rooms", roomArray);

      const default_participants = await FindRoomParticipantsfromDB(roomArray);
      socket.emit("default_participants", default_participants);

      const default_messages = await LoadDefaultMessagesfromDB(roomArray);
      socket.emit("default_messages", default_messages);
    }
  }

  ///////////////////////
  // INITIALIZATION
  //////////////////////

  default_handling();

  ////////////////////////////////////////////////////////////////////////
  //                     SOCKET IO EVENT HANDLING                      //

  socket.on("join-room", async (roomID, callback) => {
    try {
      await JoinRoominDB(roomID, userID);
      await default_handling(); // default rooms and messages reloading after joining room
      callback({ message: "Successfully Joined Room" });
    } catch (error) {
      callback({ message: error.message });
    }
  });

  socket.on("exit-room", async (roomID, callback) => {
    try {
      await ExitRoominDB(roomID, userID);
      await default_handling(); // default rooms and messages reloading after exiting room
      callback({ message: "Successfully Exited Room" });
    } catch (error) {
      callback({ message: error.message });
    }
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
      (MSG) => console.log("Message Stored in DB", MSG),
      (errorMsg) => console.log("Error while Storing : ", errorMsg)
    );
  });
});

//-----------------------------------------------------------

server.listen(3000, () => {
  console.log("Server Listening at 3000");
});
