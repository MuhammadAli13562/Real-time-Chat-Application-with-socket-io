import { useState } from "react";
import { muiExports } from "../assets/materialUI";
import { socket } from "../utils/socket";

export const JoinRoom = () => {
  const { TextField, Button } = muiExports;
  const [roomid, setroomid] = useState("");
  const [disable, setdisable] = useState(false);
  const [message, setmessage] = useState("");

  function handleJoinRoom() {
    setdisable(true);
    socket.emit("join-room", roomid, (response) => {
      if (response.message.split(" ")[0] === "duplicate") {
        setmessage("Room Already Joined");
      } else if (response.message.split(" ")[0] === "Successfully") {
        setmessage("Room Entered Successfuly");
      } else setmessage(response.message);
    });
    setdisable(false);
    setroomid("");
  }

  return (
    <div>
      <TextField
        variant="outlined"
        placeholder="Enter Room ID"
        color="info"
        onChange={(e) => setroomid(e.target.value)}
        value={roomid}
        sx={{
          paddingLeft: "30px",
          paddingTop: "10px",
          marginBottom: "10px",
          minwidth: "100px",
          maxwidth: "300px",
        }}
      />
      <Button
        variant="contained"
        disabled={disable}
        color="warning"
        sx={{
          marginLeft: "100px",
          width: "100px",
        }}
        onClick={handleJoinRoom}
      >
        Join
      </Button>
      <p>{message}</p>
    </div>
  );
};
