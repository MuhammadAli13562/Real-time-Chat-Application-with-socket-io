import { useEffect } from "react";
import ChatSelector from "../components/ChatSelector";
import { useNavigate } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import "../styles/custom.css";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { SelectedUserState } from "../utils/atoms";
import { socket } from "../utils/socket";

export default function Chats() {
  console.log("at top of Chats");
  const navigate = useNavigate();

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  });

  useEffect(() => {
    function callback1(response) {
      console.log("Returned in Success : ", response);
    }

    function callback2(response) {
      console.log("Returned with error : ", response);
      navigate("/login");
    }

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

  return (
    <div className="chat-page-wrapper">
      <ChatSelector />
      <ChatBox />
    </div>
  );
}
