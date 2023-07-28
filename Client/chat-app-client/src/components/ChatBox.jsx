import "../styles/custom.css";
import { useState, useEffect, useRef } from "react";
import { muiExports } from "../assets/materialUI";
import { MessagesState, SelectedUserState } from "../utils/atoms";
import { useRecoilValue } from "recoil";
import { socket } from "../utils/socket";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MessageCard from "./MessageCard";

export default function ChatBox() {
  const { Button, TextField, SendIcon } = muiExports;

  console.log("re-render Chatbox");
  const messages = useRecoilValue(MessagesState);
  const selectedUser = useRecoilValue(SelectedUserState);
  const [currentMsg, setcurrentMsg] = useState("");
  const navigate = useNavigate();
  const chatBoxRef = useRef(null);

  function handleMessageSend() {
    socket.emit("room-message-client", currentMsg, selectedUser);
    setcurrentMsg("");
  }

  useEffect(() => {
    chatBoxRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUser]);

  useEffect(() => {
    function callback1(response) {
      console.log("Returned in Success : ", response);
    }

    function callback2(response) {
      console.log("Returned with error : ", response);
      navigate("/login");
    }

    // VERIFY TOKEN
    axios
      .post(
        "http://localhost:3000/verify",
        {},
        {
          headers: {
            authorization: "bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then(callback1, callback2);
  }, []);

  if (selectedUser === "") {
    return <div className="chat-box-wrapper"> ChatBox </div>;
  }

  return (
    <div className="chat-box-wrapper">
      <div className="chat-box-inside-wrapper">
        {messages
          .filter((elem) => elem.roomid === selectedUser)
          .map((elem) => {
            if (elem.sendername === localStorage.getItem("username")) {
              return (
                <div className="card-wrapper-sender">
                  <MessageCard msg={elem} />
                </div>
              );
            } else {
              return (
                <div className="card-wrapper">
                  <MessageCard msg={elem} />
                </div>
              );
            }
          })}
        <div ref={chatBoxRef} />
      </div>
      <div className="chat-box-message-form-wrapper">
        <TextField
          variant="outlined"
          placeholder="Type Message"
          type="text"
          value={currentMsg}
          onChange={(e) => setcurrentMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              handleMessageSend();
            }
          }}
          sx={{
            color: "blue",
          }}
          className="chat-box-message-form-textfield"
        />
        <Button
          variant="contained"
          size="medium"
          endIcon={<SendIcon />}
          onClick={handleMessageSend}
          className="chat-box-message-form-button-textfield"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
